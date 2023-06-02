import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { getClsHookData } from 'src/utils/getClsHookData';
import { plainToInstance } from 'class-transformer';
import { Activity } from './activity.entity';
import { Role } from 'src/user/entities/user.entity';
@Injectable()
export class ActivityService {
  @InjectRepository(Activity)
  protected readonly repo: Repository<Activity>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  async create(
    userName: string,
    type: number,
    time: string,
    addr: string,
    fuze: string,
  ): Promise<void> {
    const createData = this.repo.create({
      userName,
      type,
      time,
      addr,
      fuze,
    });
    await this.repo.save(createData);
  }

  async getActivityList():Promise<Activity[]>{
    const role = this.role
    const qb = this.repo.createQueryBuilder('activity')
    if(role===Role.laotou){
        return qb.where('activity.userName = :userName',{userName:this.userName}).getMany()
    }
    return qb.getMany()
  }
}
