import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { Tool } from './tool.entity';
import { CreateToolDto } from './tool-create.dto';

@Controller('/tool')
@UsePipes(new ValidationPipe())
export class ToolController {
  @Inject(ToolService)
  protected readonly service: ToolService;

  @Post('/create')
  async create(@Body() createToolDto: CreateToolDto): Promise<void> {
    return this.service.create(createToolDto);
  }

  @Post('/getList')
  async getList(): Promise<Tool[]> {
    return this.service.getList();
  }

  @Post('/changeRate')
  async changeRate(
    @Body('id') id: number,
    @Body('rate') rate: number,
  ): Promise<Tool> {
    return this.service.changeRate(id, rate);
  }

  @Post('/saveRate')
  async saveRate(
    @Body('id') id: number,
    @Body('evaluation') evaluation: number,
    @Body('content') content: string,
  ): Promise<void> {
    return this.service.saveData(id, evaluation, content);
  }

  @Post('/changeState')
  async changeState(
    @Body('id') id: number,
    @Body('state') state: number,
  ): Promise<void> {
    return this.service.changeState(id, state);
  }
}
