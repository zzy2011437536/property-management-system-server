import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator"
import { AuditStatus } from "../entities/user.audit.entity"
import { Role } from "../entities/user.entity"

export class AuditUserDto{
    @IsInt({
        message:'id格式不对'
    })
    id: number

    @IsInt({
        message:'userId格式不对'
    })
    userId: number

    @IsEnum(AuditStatus,{
        message:'审批决策不对'
    })
    auditStatus: AuditStatus
}