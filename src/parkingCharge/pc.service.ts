import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { getClsHookData } from 'src/utils/getClsHookData';
import { Bill, BillType } from 'src/bill/bill.entity';
import { plainToInstance } from 'class-transformer';
import { PC } from './pc.entity';

@Injectable()
export class PCService {
  @InjectRepository(PC)
  protected readonly repo: Repository<PC>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  private get userId(): number {
    return getClsHookData('userId');
  }

  // async onModuleInit() {
  //   await this.repo.clear();
  //   const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  //   const createList = [];
  //   for (let j = 0; j < arr.length; j++) {
  //     for (let i = 1; i <= 10; i++) {
  //       createList.push(
  //         this.repo.create({
  //           name: String(i),
  //           zone: arr[j],
  //         }),
  //       );
  //     }
  //   }
  //   await Promise.all(
  //     createList.map((item) => {
  //       return this.repo.save(item);
  //     }),
  //   );
  // }

  async getList(): Promise<PC[]> {
    // const { userName, contactInformation, status, role } = userListDto;
    const qb = this.repo.createQueryBuilder('pc');
    // if (status) {
    //   qb.andWhere('user.status = :status', { status });
    // }
    // if (role) {
    //   qb.andWhere('user.role = :role', { role });
    // }
    // if (userName) {
    //   const content = `%${userName}%`;
    //   qb.andWhere(
    //     new Brackets((q) => {
    //       q.where('user.userName LIKE :content', { content });
    //     }),
    //   );
    // }
    // if (contactInformation) {
    //   const content = `%${contactInformation}%`;
    //   qb.andWhere(
    //     new Brackets((q) => {
    //       q.where('user.contactInformation LIKE :content', { content });
    //     }),
    //   );
    // }
    const data = await qb.getMany();
    console.log(123123, data);
    return plainToInstance(PC, data);
  }

  async getInfo(id: number): Promise<PC> {
    return this.repo
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.user', 'user')
      .where('pc.id = :id', { id })
      .getOne();
  }

  async bindUserInParking(id: number, userId?: number): Promise<void> {
    if (!userId) {
      await this.repo.update(id, {
        userId: 0,
        status: 0,
      });
    } else {
      await this.repo.update(id, {
        userId,
        status: 1,
      });
    }
  }
}
