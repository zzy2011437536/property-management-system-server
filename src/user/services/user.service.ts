import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { User } from '../entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { UserListDto } from '../dto/user-list.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UserService {
  @InjectRepository(User)
  protected readonly repo: Repository<User>;

  private get userName(): string {
    return getClsHookData('userName');
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
    });
    await this.repo.save(createUserData);
  }

  async login(loginUser: LoginUserDto): Promise<any> {
    const { userName, password } = loginUser;
    // console.log(loginUser);
    const userData = await this.repo.findOne({
      where: {
        userName,
        password,
      },
    });
    if (userData) {
      return userData;
    } else {
      throw new CustomException({
        message: '用户或密码错误',
      });
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
    const { userName, contact, role } = userListDto;
    const qb = this.repo.createQueryBuilder('user');
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
    if (contact) {
      const content = `%${contact}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('user.contact LIKE :content', { content });
        }),
      );
    }
    const data = await qb.getMany();
    return plainToInstance(User, data);
  }
}
