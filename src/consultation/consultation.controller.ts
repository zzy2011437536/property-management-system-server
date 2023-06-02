import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { ConsultationService } from './consultation.service';
import { Consultation } from './consultation.entity';
@Controller('/consultation')
@UsePipes(new ValidationPipe())
export class ConsultationController {
  @Inject(ConsultationService)
  protected readonly service: ConsultationService;

  @Post('/create')
  async create(
    @Body('userName') userName: string,
    @Body('desc') desc: string,
    @Body('doctor') doctor: string,
  ): Promise<void> {
    // const ticket = req.cookies['ticket'];
    return this.service.create(userName, desc, doctor);
  }

  @Post('/doctorOrder')
  async doctorCreate(
    @Body('id') id: number,
    @Body('order') order: string,
    @Body('endTime') endTime: string,
  ): Promise<void> {
    // const ticket = req.cookies['ticket'];
    return this.service.doctorOrder(id, order, endTime);
  }

  @Post('/getList')
  async getConsultationList(): Promise<Consultation[]> {
    return this.service.getConsultationList();
  }
}
