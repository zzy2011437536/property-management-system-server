import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountMap, Tool, vipLevel } from './tool.entity';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { getClsHookData } from 'src/utils/getClsHookData';
import { CreateToolDto } from './tool-create.dto';
import { Bill, BillType } from 'src/bill/bill.entity';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';

@Injectable()
export class ToolService {
  @InjectRepository(Tool)
  protected readonly repo: Repository<Tool>;

  @InjectRepository(Bill)
  protected readonly billRepo: Repository<Bill>;

  @Inject(UserService)
  protected readonly userService: UserService;

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

  async create(createToolDto: CreateToolDto): Promise<void> {
    const { type, tollGathererId, roomId, description } = createToolDto;
    console.log(123123, this.userId, AmountMap[type] * vipLevel[this.vipLevel]);
    const createData = this.repo.create({
      type,
      amount: AmountMap[type] * vipLevel[this.vipLevel],
      roomId,
      userId: this.userId,
      tollGathererId,
      description,
    });
    const saveData = await this.repo.save(createData);
    const time = moment().format('YYYYMMDD');
    let number = '' + createData.id;
    if (+number < 10) {
      number = '000' + number;
    } else if (+number < 100) {
      number = '00' + number;
    } else if (+number < 1000) {
      number = '0' + number;
    }
    const str = time + '1' + number;
    await this.repo.save({
      ...saveData,
      billNumber: str,
    });
  }

  async getList(): Promise<Tool[]> {
    const qb = this.repo
      .createQueryBuilder('tool')
      .leftJoinAndSelect('tool.user', 'user')
      .leftJoinAndSelect('tool.tollGatherer', 'tollGatherer')
      .leftJoinAndSelect('tool.room', 'room');
    console.log(111111, this.role);
    if (this.role === Role.admin) {
    } else if (this.role === Role.maintenance) {
      console.log(111111, this.role);
      qb.where('tool.tollGathererId =:id', { id: this.userId });
    } else if (this.role === Role.resident) {
      qb.where('tool.userId =:id', { id: this.userId });
    }
    const data = await qb.getMany();
    console.log(123123213, this.userId, data);
    return plainToInstance(Tool, data);
  }

  async changeRate(id: number, rate: number): Promise<Tool> {
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

  async saveData(
    id: number,
    evaluation: number,
    content: string,
  ): Promise<void> {
    const data = await this.repo.findOne({
      where: { id },
    });
    await this.repo.save({
      ...data,
      evaluation,
      content,
    });
  }

  async changeState(id: number, state: number): Promise<void> {
    await this.repo.update(id, {
      state,
    });
  }
}
