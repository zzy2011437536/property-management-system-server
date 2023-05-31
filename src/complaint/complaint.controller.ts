import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Complaint } from './complaint.entity';
import { ComplaintService } from './complaint.service';

@Controller('/complaint')
export class ComplaintController {
  @Inject(ComplaintService)
  protected readonly service: ComplaintService;

  @Post('/create')
  async create(@Body('complaint') complaint: string): Promise<void> {
    return this.service.create(complaint);
  }

  @Post('/getList')
  async getList(): Promise<Complaint[]> {
    return this.service.getList();
  }
}
