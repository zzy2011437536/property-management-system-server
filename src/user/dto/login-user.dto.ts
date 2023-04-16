import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString({
    message: '用户名格式不对',
  })
  @Length(1, 16, {
    message: '用户名长度不对',
  })
  userName: string;

  @IsNotEmpty()
  @IsString({
    message: '密码格式不对',
  })
  @Length(6, 16, {
    message: '密码长度不对',
  })
  password: string;
}
