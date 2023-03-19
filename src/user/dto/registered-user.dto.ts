import { IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Role } from "../entities/user.entity";

export class RegisteredUser{
    @IsNotEmpty({
        message: '姓名不能为空'
    })
    @IsString({
        message:'请输入正确的姓名'
    })
    readonly userName: string;

    @IsOptional()
    @IsNotEmpty({
        message: '住址不能为空'
    })
    @IsString({
        message:'请输入正确的住址'
    })
    readonly zone: string;

    @IsOptional()
    @IsNotEmpty({
        message: '住址不能为空'
    })
    @IsString({
        message:'请输入正确的住址'
    })
    readonly roomName: string;

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

    contactInformation: number

    @IsEnum(Role,{
        message:'角色不正确'
    })
    role:Role
}