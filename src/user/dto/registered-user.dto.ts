import {
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export class RegisteredUser {
  @IsNotEmpty({
    message: '姓名不能为空',
  })
  @IsString({
    message: '请输入正确的姓名',
  })
  readonly userName: string;

  @IsString({
    message: '密码格式不对',
  })
  password: string;

  @IsNotEmpty({
    message: '手机号不能为空',
  })
  @IsString({
    message: '请输入正确的手机号',
  })
  contact: string;

  @IsEnum(Role, {
    message: '角色不正确',
  })
  role: Role;

  @IsOptional()
  @IsString()
  parent?: string;
}
