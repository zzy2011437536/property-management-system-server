import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PCService } from './pc.service';
import { PC } from './pc.entity';

@Controller('/parking')
@UsePipes(new ValidationPipe())
export class PCController {
  @Inject(PCService)
  protected readonly service: PCService;

  @Post('/getList')
  async getList(): Promise<PC[]> {
    return this.service.getList();
  }

  @Post('/getInfo')
  async getInfo(@Body('id') id: number): Promise<PC> {
    return this.service.getInfo(id);
  }

  @Post('/bindUserInParking')
  async bindUserInParking(
    @Body('id') id: number,
    @Body('userId') userId: number,
  ): Promise<void> {
    return this.service.bindUserInParking(id, userId);
  }
}
