import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { AuditStatus } from '../entities/user.audit.entity';
import { Role, StatusType } from '../entities/user.entity';

export class ChangeUserStatusDto {
  @IsString({
    message: 'ticket格式不对',
  })
  ticket: string;

  @IsEnum(StatusType, {
    message: '账号状态不对',
  })
  statusType: StatusType;
}
