import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { getClsHookData } from 'src/utils/getClsHookData';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/user/entities/user.entity';
import { Serve } from './serve.entity';
@Injectable()
export class ServeService {
  @InjectRepository(Serve)
  protected readonly repo: Repository<Serve>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  async create(
    userName: string,
    type: number,
    amount: string,
    description: string,
    time: string,
    fuze: string,
  ): Promise<void> {
    const createData = this.repo.create({
      userName,
      type,
      amount,
      description,
      time,
      fuze,
    });
    await this.repo.save(createData);
  }

  async getServeList(): Promise<Serve[]> {
    const role = this.role;
    const qb = this.repo.createQueryBuilder('serve');
    if (role === Role.laotou) {
      return qb
        .where('serve.userName = :userName', { userName: this.userName })
        .getMany();
    } else if (role === Role.fuwurenyuan) {
      return qb
        .where('serve.fuze = :userName', { userName: this.userName })
        .getMany();
    }
    return qb.getMany();
  }

  async rate(id: number, rate: string, evation: string): Promise<void> {
    const info = await this.repo.findOne({ where: { id } });
    await this.repo.save({
      ...info,
      rate,
      evation,
    });
  }
}
