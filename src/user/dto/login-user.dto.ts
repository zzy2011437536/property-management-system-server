import { IsEnum, IsOptional, IsString, Length } from "class-validator"
import { Role } from "../entities/user.entity"

export class LoginUserDto{
    @IsString({
        message:'密码格式不对'
    })
    @Length(1,16,{
        message:'账号长度不对'
    })
    account: string

    @IsString({
        message:'密码格式不对'
    })
    @Length(6,16,{
        message:'密码长度不对'
    })
    password: string

    @IsEnum(Role,{
        message:'角色不正确'
    })
    role:Role
}