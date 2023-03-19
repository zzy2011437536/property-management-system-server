import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator"
import { AuditStatus } from "../entities/user.audit.entity"
import { StatusType } from "../entities/user.entity"

export class UserListDto{
    @IsInt({
        message:'无效的页码'
    })
    page: number

    @IsInt({
        message:'无效的每页数量'
    })
    limit: number

    @IsOptional()
    @IsEnum(StatusType,{
        message:'用户状态不正确'
    })
    status: StatusType

    @IsOptional()
    @IsString({
        message:'自定义搜索格式不正确'
    })
    search: string
}