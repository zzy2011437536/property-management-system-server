import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UserListDto {
  @IsOptional()
  @IsString({
    message: '用户名格式不正确',
  })
  userName: string;

  @IsOptional()
  @IsString({
    message: '联系方式格式不正确',
  })
  contactInformation: string;

  @IsOptional()
  @IsEnum(Role, {
    message: '角色不正确',
  })
  role: Role;
}
