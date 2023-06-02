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
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
@Controller('/activity')
@UsePipes(new ValidationPipe())
export class ActivityController {
  @Inject(ActivityService)
  protected readonly service: ActivityService;

  @Post('/create')
  async create(
    @Body('userName') userName: string,
    @Body('type') type: number,
    @Body('time') time: string,
    @Body('addr') addr: string,
    @Body('fuze') fuze: string,
  ): Promise<void> {
    // const ticket = req.cookies['ticket'];
    return this.service.create(userName, type, time, addr, fuze);
  }

  @Post('/getList')
  async getActivityList(): Promise<Activity[]> {
    return this.service.getActivityList();
  }
}
