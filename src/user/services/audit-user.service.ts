import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { StatusType, User } from '../entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import {
  AuditStatus,
  AuditType,
  UserAudit,
} from '../entities/user.audit.entity';
import { AuditUserDto } from '../dto/audit-user.dto';
import { AuditUserListDto } from '../dto/list-user-audit.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

export interface IHttpResultPaginate<T> {
  list: T[];
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

@Injectable()
export class UserAuditService {
  @InjectRepository(User)
  protected readonly userRepo: Repository<User>;
  @InjectRepository(UserAudit)
  protected readonly repo: Repository<UserAudit>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  async getAuditList(
    auditUserListDto: AuditUserListDto,
  ): Promise<IHttpResultPaginate<UserAudit>> {
    const { page, limit, auditStatus } = auditUserListDto;
    const qb = this.repo.createQueryBuilder('ua');
    if (auditStatus) {
      qb.where('ua.auditStatus = :auditStatus', { auditStatus });
    }
    const [list, total] = await qb
      .take(limit)
      .skip(limit * (page-1))
      .orderBy('ua.id', 'ASC')
      .getManyAndCount();
      return {
        total,
        perPage:limit,
        currentPage:page,
        lastPage:Math.ceil(total/limit),
        list:plainToInstance(UserAudit,list)
      }
  }
  async resolve(auditUserDto: AuditUserDto): Promise<void> {
    const { id, userId, auditStatus } = auditUserDto;
    const [userAuditData, userData] = await Promise.all([
      this.repo.findOne({ where: { id } }),
      this.userRepo.findOne({ where: { id: userId } }),
    ]);
    if (!userAuditData) {
      throw new CustomException({
        message: '未找到审批工单',
      });
    }
    if (
      auditStatus === AuditStatus.success &&
      userAuditData.auditType === AuditType.createUser
    ) {
      //如果审批通过,并且是申请账号类型,那么在用户表也变更状态
      await this.userRepo.save({
        ...userData,
        status: StatusType.success,
      });
    }
    await this.repo.save({
      ...userAuditData,
      auditStatus,
      auditor: this.userName,
    });
  }
}
