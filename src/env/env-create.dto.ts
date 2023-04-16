import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EnvType } from './env.entity';

export class CreateEnvDto {
  @IsNotEmpty()
  @IsEnum(EnvType)
  type: EnvType;

  @IsNotEmpty()
  @IsInt()
  tollGathererId: number;

  @IsNotEmpty()
  @IsInt()
  roomId: number;
}
