import {
  Controller,
  Inject,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { BillListDto } from './bill-list.dto';

@Controller('/bill')
@UsePipes(new ValidationPipe())
export class BillController {
  @Inject(BillService)
  protected readonly service: BillService;
  @Post('/getList')
  async getList(@Body() billListDto: BillListDto): Promise<any> {
    return this.service.getList(billListDto);
  }
}
