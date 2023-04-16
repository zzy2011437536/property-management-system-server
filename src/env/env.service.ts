import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountMap, Env } from './env.entity';
import { CreateEnvDto } from './env-create.dto';
import { getClsHookData } from 'src/utils/getClsHookData';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Bill, BillType } from 'src/bill/bill.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EnvService {
  @InjectRepository(Env)
  protected readonly repo: Repository<Env>;

  @Inject(UserService)
  protected readonly userService: UserService;

  @InjectRepository(Bill)
  protected readonly billRepo: Repository<Bill>;

  private get userName(): string {
    return getClsHookData('userName');
  }

  private get role(): number {
    return getClsHookData('role');
  }

  private get userId(): number {
    return getClsHookData('userId');
  }

  async create(createEnvDto: CreateEnvDto): Promise<void> {
    const { type, tollGathererId, roomId } = createEnvDto;

    const createData = this.repo.create({
      type,
      amount: AmountMap[type],
      roomId,
      userId: this.userId,
      tollGathererId,
    });
    await this.repo.save(createData);

    const billCreateData = this.billRepo.create({
      userId: this.userId,
      entityId: createData.id,
      type: BillType.env,
    });
    await this.billRepo.save(billCreateData);
  }

  async getList(): Promise<Env[]> {
    const qb = this.repo
      .createQueryBuilder('env')
      .leftJoinAndSelect('env.user', 'user')
      .leftJoinAndSelect('env.tollGatherer', 'tollGatherer')
      .leftJoinAndSelect('env.room', 'room');
    if (this.role === Role.admin) {
    } else if (this.role === Role.cleaning) {
      qb.where('env.tollGathererId =:id', { id: this.userId });
    } else if (this.role === Role.resident) {
      qb.where('env.userId =:id', { id: this.userId });
    }
    const data = await qb.getMany();
    return plainToInstance(Env, data);
  }

  async changeRate(id: number, rate: number): Promise<Env> {
    const data = await this.repo.findOne({
      where: {
        id,
      },
    });
    return this.repo.save({
      ...data,
      evaluation: rate,
    });
  }
}
