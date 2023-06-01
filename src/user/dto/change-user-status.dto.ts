import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../entities/user.entity';

export class ChangeUserStatusDto {
  @IsString({
    message: 'ticket格式不对',
  })
  ticket: string;
}
