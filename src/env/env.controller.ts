import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EnvService } from './env.service';
import { CreateEnvDto } from './env-create.dto';
import { Env } from './env.entity';

@Controller('/env')
@UsePipes(new ValidationPipe())
export class EnvController {
  @Inject(EnvService)
  protected readonly service: EnvService;

  @Post('/create')
  async create(@Body() createEnvDto: CreateEnvDto): Promise<void> {
    return this.service.create(createEnvDto);
  }

  @Post('/getList')
  async getList(): Promise<Env[]> {
    return this.service.getList();
  }

  @Post('/changeRate')
  async changeRate(
    @Body('id') id: number,
    @Body('rate') rate: number,
  ): Promise<Env> {
    return this.service.changeRate(id, rate);
  }
}
