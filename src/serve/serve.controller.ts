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
import { Activity } from 'src/activity/activity.entity';
import { ServeService } from './serve.service';
import { Serve } from './serve.entity';
@Controller('/serve')
@UsePipes(new ValidationPipe())
export class ServeController {
  @Inject(ServeService)
  protected readonly service: ServeService;

  @Post('/create')
  async create(
    @Body('userName') userName: string,
    @Body('type') type: number,
    @Body('amount') amount: string,
    @Body('description') description: string,
    @Body('time') time: string,
    @Body('fuze') fuze: string,
  ): Promise<void> {
    // const ticket = req.cookies['ticket'];
    return this.service.create(userName, type, amount, description, time, fuze);
  }

  @Post('/getList')
  async getServeList(): Promise<Serve[]> {
    return this.service.getServeList();
  }

  @Post('/rate')
  async rate(
    @Body('id') id: number,
    @Body('rate') rate: string,
    @Body('evation') evation: string,
  ): Promise<void> {
    return this.service.rate(id, rate, evation);
  }
}
