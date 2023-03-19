import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { StatusType, User } from '../entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { AuditType, UserAudit } from '../entities/user.audit.entity';
import { IHttpResultPaginate } from './audit-user.service';
import { UserListDto } from '../dto/user-list.dto';
import { plainToInstance } from 'class-transformer';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
@Injectable()
export class UserService {
  @InjectRepository(User)
  protected readonly repo: Repository<User>;

  @InjectRepository(UserAudit)
  protected readonly userAuditRepo: Repository<UserAudit>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  async create(RegisteredUser: RegisteredUser): Promise<void> {
    const judgeUserExist = await this.repo.count({
      where: {
        account: RegisteredUser.account,
      },
    });
    if (judgeUserExist) {
      throw new CustomException({
        errorCode: ErrorCode.createUserError.CODE,
      });
    }
    const createUserData = this.repo.create({
      ...RegisteredUser,
      status: StatusType.applying,
    });
    const saveUserData = await this.repo.save(createUserData);
    const createUserAuditData = this.userAuditRepo.create({
      userId: saveUserData.id,
      auditType: AuditType.createUser,
      auditReason: '注册账号',
    });
    await this.userAuditRepo.save(createUserAuditData);
  }

  async login(
    loginUser: LoginUserDto,
  ): Promise<{ code: number; message: string; ticket?: string }> {
    const { account, password, role } = loginUser;
    const userData = await this.repo.findOne({
      where: {
        account,
        password,
        role,
      },
    });
    if (!userData) {
      return {
        code: ErrorCode.loginUserError.CODE,
        message: ErrorCode.loginUserError.MESSAGE,
      };
    } else {
      // switch(userData.status){
      //   case StatusType.success:{
      //     return {
      //       code: ErrorCode.SUCCESS.CODE,
      //       message: ErrorCode.SUCCESS.MESSAGE,
      //       ticket: userData?.ticket,
      //     }
      //   }
      // }
      if (userData.status === StatusType.success) {
        return {
          code: ErrorCode.SUCCESS.CODE,
          message: ErrorCode.SUCCESS.MESSAGE,
          ticket: userData?.ticket,
        };
      } else if (userData.status === StatusType.ShutDown) {
        return {
          code: ErrorCode.shutDownUserError.CODE,
          message: ErrorCode.shutDownUserError.MESSAGE,
        };
      } else if (userData.status === StatusType.applying) {
        return {
          code: ErrorCode.applyingUserError.CODE,
          message: ErrorCode.applyingUserError.MESSAGE,
        };
      } else if (userData.status === StatusType.applyReject) {
        return {
          code: ErrorCode.applyRejectUserError.CODE,
          message: ErrorCode.applyRejectUserError.MESSAGE,
        };
      }
    }
  }
  async getUserDataByTicket(ticket: string): Promise<User> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rooms', 'room')
      .where('user.ticket = :ticket', { ticket })
      .getOne();
  }

  async getUserList(
    userListDto: UserListDto,
  ): Promise<IHttpResultPaginate<User>> {
    const { page, limit, status, search } = userListDto;
    const qb = this.repo.createQueryBuilder('user');
    if (status) {
      qb.where('user.status = :status', { status });
    }
    if (search) {
      const content = `%${search}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('user.userName LIKE :content', { content }).orWhere(
            'user.account LIKE :content',
            { content },
          );
        }),
      );
    }
    const [list, total] = await qb
      .take(limit)
      .skip(limit * (page - 1))
      .orderBy('user.id', 'ASC')
      .getManyAndCount();
    return {
      total,
      perPage: limit,
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      list: plainToInstance(User, list),
    };
  }

  async changeUserStatus(
    changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<User> {
    const { account, statusType } = changeUserStatusDto;
    const userData = await this.repo.findOne({
      where: {
        account,
      },
    });
    if (!userData) {
      throw new CustomException({
        message: '账号不存在',
      });
    }
    const saveData = await this.repo.save({
      ...userData,
      status: statusType,
    });
    return plainToInstance(User, saveData);
  }
}
