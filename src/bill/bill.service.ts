import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill, BillType } from './bill.entity';
import { getClsHookData } from 'src/utils/getClsHookData';

import { ToolService } from 'src/tool/tool.service';
import { BillListDto } from './bill-list.dto';

@Injectable()
export class BillService {
  @InjectRepository(Bill)
  protected readonly repo: Repository<Bill>;

  @Inject(ToolService)
  protected readonly toolService: ToolService;

  private get userId(): number {
    return getClsHookData('userId');
  }

  async getList(billListDto: BillListDto): Promise<any> {
    const [toolList] = await Promise.all([this.toolService.getList()]);
    const newToolList = toolList.map((item) => {
      return {
        ...item,
        type: BillType.tool,
      };
    });
    return [...newToolList];
  }
}
