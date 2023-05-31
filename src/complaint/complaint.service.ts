import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/user/entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { plainToInstance } from 'class-transformer';
import { Complaint } from './complaint.entity';

@Injectable()
export class ComplaintService {
  @InjectRepository(Complaint)
  protected readonly repo: Repository<Complaint>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  private get userId(): number {
    return getClsHookData('userId');
  }

  private get vipLevel(): string {
    return getClsHookData('vipLevel');
  }

  async create(complaint: string): Promise<void> {
    const createData = this.repo.create({
      userName: this.userName,
      complaint,
    });

    await this.repo.save(createData);
  }

  async getList(): Promise<Complaint[]> {
    const qb = this.repo.createQueryBuilder('complaint');
    if (this.role === Role.admin) {
    } else if (this.role === Role.resident) {
      qb.where('complaint.userName =:userName', { userName: this.userName });
    }
    const data = await qb.getMany();
    return plainToInstance(Complaint, data);
  }
}
