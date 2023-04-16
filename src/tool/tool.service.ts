import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountMap, Tool } from './tool.entity';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { getClsHookData } from 'src/utils/getClsHookData';
import { CreateToolDto } from './tool-create.dto';
import { Bill, BillType } from 'src/bill/bill.entity';
import { plainToInstance } from 'class-transformer';

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

  async create(createToolDto: CreateToolDto): Promise<void> {
    const { type, tollGathererId, roomId } = createToolDto;

    const createData = this.repo.create({
      type,
      amount: AmountMap[type],
      roomId,
      userId: this.userId,
      tollGathererId,
    });

    const saveData = await this.repo.save(createData);
    const billCreateData = this.billRepo.create({
      userId: this.userId,
      entityId: saveData.id,
      type: BillType.tool,
    });
    await this.billRepo.save(billCreateData);
  }

  async getList(): Promise<Tool[]> {
    const qb = this.repo
      .createQueryBuilder('tool')
      .leftJoinAndSelect('tool.user', 'user')
      .leftJoinAndSelect('tool.tollGatherer', 'tollGatherer')
      .leftJoinAndSelect('tool.room', 'room');
    if (this.role === Role.admin) {
    } else if (this.role === Role.cleaning) {
      qb.where('tool.tollGathererId =:id', { id: this.userId });
    } else if (this.role === Role.resident) {
      qb.where('tool.userId =:id', { id: this.userId });
    }
    const data = await qb.getMany();
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
}
