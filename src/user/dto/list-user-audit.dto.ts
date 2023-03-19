import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator"
import { AuditStatus } from "../entities/user.audit.entity"

export class AuditUserListDto{
    @IsInt({
        message:'无效的页码'
    })
    page: number

    @IsInt({
        message:'无效的每页数量'
    })
    limit: number

    @IsOptional()
    @IsEnum(AuditStatus,{
        message:'审批决策不正确'
    })
    auditStatus: AuditStatus
}