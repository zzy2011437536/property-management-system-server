import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { StatusType, User } from '../entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { UserListDto } from '../dto/user-list.dto';
import { plainToInstance } from 'class-transformer';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
import { format } from 'path';
import moment from 'moment';
@Injectable()
export class UserService {
  @InjectRepository(User)
  protected readonly repo: Repository<User>;

  private get userName(): string {
    return getClsHookData('userName');
  }
  private get userId(): number {
    return getClsHookData('userId');
  }

  private get vipLevel(): string {
    return getClsHookData('vipLevel');
  }

  async create(RegisteredUser: RegisteredUser): Promise<void> {
    const judgeUserExist = await this.repo.count({
      where: {
        userName: RegisteredUser.userName,
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

    const saveData = await this.repo.save(createUserData);
    const time = moment().format('YYYYMMDD');
    let number = '' + saveData.id;
    if (+number < 10) {
      number = '000' + number;
    } else if (+number < 100) {
      number = '00' + number;
    } else if (+number < 1000) {
      number = '0' + number;
    }
    const str = time + String(createUserData.role) + number;
    await this.repo.save({
      ...saveData,
      subscriberNumber: str,
    });
  }

  async login(
    loginUser: LoginUserDto,
  ): Promise<{ code: number; message: string; ticket?: string }> {
    const { userName, password } = loginUser;
    // console.log(loginUser);
    const userData = await this.repo.findOne({
      where: {
        userName,
        password,
      },
    });
    if (!userData) {
      throw new CustomException({
        errorCode: ErrorCode.loginUserError.CODE,
      });
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
          ticket: userData.ticket,
        };
      } else if (userData.status === StatusType.ShutDown) {
        throw new CustomException({
          errorCode: ErrorCode.shutDownUserError.CODE,
        });
      } else if (userData.status === StatusType.applying) {
        throw new CustomException({
          errorCode: ErrorCode.applyingUserError.CODE,
        });
      } else if (userData.status === StatusType.applyReject) {
        throw new CustomException({
          errorCode: ErrorCode.applyRejectUserError.CODE,
        });
      }
    }
  }
  async getUserDataByTicket(ticket: string): Promise<User> {
    if (!ticket) {
      throw new CustomException({
        message: `没有ticket,${ticket}`,
      });
    }
    const data = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rooms', 'room')
      .where('user.ticket =:ticket', { ticket })
      .getOne();
    // const data = await this.repo.findOne({
    //   where: {
    //     ticket,
    //   },
    // });
    if (!data) {
      throw new CustomException({
        message: 'ticket不正确',
      });
    }
    return plainToInstance(User, data);
  }

  async getUserList(userListDto: UserListDto): Promise<User[]> {
    const { userName, contactInformation, status, role } = userListDto;
    const qb = this.repo.createQueryBuilder('user');
    if (status) {
      qb.andWhere('user.status = :status', { status });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }
    if (userName) {
      const content = `%${userName}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('user.userName LIKE :content', { content });
        }),
      );
    }
    if (contactInformation) {
      const content = `%${contactInformation}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('user.contactInformation LIKE :content', { content });
        }),
      );
    }
    const data = await qb.getMany();
    return plainToInstance(User, data);
  }

  async changeUserStatus(
    changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<User> {
    const { ticket, statusType } = changeUserStatusDto;
    const userData = await this.repo.findOne({
      where: {
        ticket,
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

  async saveUserInfo(ticket: string, password: string): Promise<User> {
    const userInfo = await this.repo.findOne({
      where: {
        ticket,
      },
    });
    const data = await this.repo.save({
      ...userInfo,
      password,
    });
    console.log(data);
    return data;
  }

  async getUserIdByUserName(userName: string): Promise<User> {
    return this.repo.findOne({
      where: {
        userName,
      },
    });
  }

  async updateVip(): Promise<void> {
    const vipLevel = this.vipLevel;
    await this.repo.update(this.userId, {
      vipLevel: `v${Number(vipLevel[1]) + 1}`,
    });
  }
}
