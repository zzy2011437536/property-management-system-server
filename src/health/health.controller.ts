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
import { HealthService } from './health.service';
import { Health } from './health.entity';
@Controller('/health')
@UsePipes(new ValidationPipe())
export class HealthController {
  @Inject(HealthService)
  protected readonly service: HealthService;

  @Post('/create')
  async create(
    @Body('userName') userName: string,
    @Body('breath') breath: string,
    @Body('rate') rate: string,
    @Body('temperature') temperature: string,
    @Body('lpressure') lpressure: string,
    @Body('hpressure') hpressure: string,
  ): Promise<void> {
    return this.service.create(
      userName,
      breath,
      rate,
      temperature,
      lpressure,
      hpressure,
    );
  }

  @Post('/getList')
  async getHealthList(): Promise<Health[]> {
    return this.service.getHealthList();
  }
}
