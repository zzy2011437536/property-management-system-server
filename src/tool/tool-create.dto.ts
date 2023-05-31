import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ToolType } from './tool.entity';

export class CreateToolDto {
  @IsNotEmpty()
  @IsEnum(ToolType)
  type: ToolType;

  @IsNotEmpty()
  @IsInt()
  tollGathererId: number;

  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @IsString()
  description: string;
}
