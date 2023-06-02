import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { getClsHookData } from 'src/utils/getClsHookData';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/user/entities/user.entity';
import { Health } from './health.entity';
import * as _ from 'lodash';
@Injectable()
export class HealthService {
  @InjectRepository(Health)
  protected readonly repo: Repository<Health>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  async create(
    userName: string,
    breath: string,
    rate: string,
    temperature: string,
    lpressure: string,
    hpressure: string,
  ): Promise<void> {
    let state = 0;
    const numberInRange = (number, min, max) => {
      return _.inRange(number, min, max);
    };
    if (
      numberInRange(+breath, 12, 20) &&
      numberInRange(+rate, 60, 90) &&
      numberInRange(+temperature, 36.1, 37.2) &&
      numberInRange(+lpressure, 60, 90) &&
      numberInRange(+hpressure, 120, 130)
    ) {
      state = 1;
    }
    const createData = this.repo.create({
      userName,
      breath,
      rate,
      temperature,
      lpressure,
      hpressure,
      state,
    });
    await this.repo.save(createData);
  }

  async getHealthList(): Promise<Health[]> {
    const role = this.role;
    const qb = this.repo.createQueryBuilder('health');
    if (role === Role.laotou) {
      return qb
        .where('health.userName = :userName', { userName: this.userName })
        .getMany();
    }
    return qb.getMany();
  }
}
