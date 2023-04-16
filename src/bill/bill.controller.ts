import {
  Controller,
  Inject,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('/bill')
@UsePipes(new ValidationPipe())
export class BillController {
  @Inject(BillService)
  protected readonly service: BillService;
  @Post('/getList')
  async getList(@Body('list') list: string[]): Promise<any> {
    return this.service.getList(list);
  }
}
