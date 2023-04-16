import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill, BillType } from './bill.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { EnvService } from 'src/env/env.service';
import { ToolService } from 'src/tool/tool.service';

@Injectable()
export class BillService {
  @InjectRepository(Bill)
  protected readonly repo: Repository<Bill>;

  @Inject(EnvService)
  protected readonly envService: EnvService;

  @Inject(ToolService)
  protected readonly toolService: ToolService;

  private get userId(): number {
    return getClsHookData('userId');
  }

  async getList(list: string[]): Promise<any> {
    const [envList, toolList] = await Promise.all([
      this.envService.getList(),
      this.toolService.getList(),
    ]);
    const res = [];
    if (list.includes('env')) {
      res.push(...envList);
    }
    if (list.includes('tool')) {
      res.push(...toolList);
    }
    return res;
  }
}
