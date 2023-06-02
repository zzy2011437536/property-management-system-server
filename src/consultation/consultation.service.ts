import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Like, Repository } from 'typeorm';
import { getClsHookData } from 'src/utils/getClsHookData';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/user/entities/user.entity';
import { Activity } from 'src/activity/activity.entity';
import { Consultation } from './consultation.entity';
@Injectable()
export class ConsultationService {
  @InjectRepository(Consultation)
  protected readonly repo: Repository<Consultation>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  async create(userName: string, desc: string, doctor: string): Promise<void> {
    const createData = this.repo.create({
      userName,
      desc,
      doctor,
    });
    await this.repo.save(createData);
  }

  async doctorOrder(id: number, order: string, endTime: string): Promise<void> {
    const info = await this.repo.findOne({
      where: { id },
    });
    await this.repo.save({
      ...info,
      order,
      endTime,
    });
  }

  async getConsultationList(): Promise<Consultation[]> {
    const role = this.role;
    const qb = this.repo.createQueryBuilder('consultation');
    if (role === Role.laotou) {
      return qb
        .where('consultation.userName = :userName', { userName: this.userName })
        .getMany();
    } else if (role === Role.yiliaorenyuan) {
      return qb
        .where('consultation.doctor = :userName', { userName: this.userName })
        .getMany();
    }
    return qb.getMany();
  }
}
