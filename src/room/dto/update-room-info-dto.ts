import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator"
import { RoomStatusType } from "../entities/room.entity"

export class UpdateRoomInfoDto{
    @IsInt({
        message:'id格式不对'
    })
    id: number

    @IsOptional()
    @IsString({
        message:'userId格式不对',
    })
    @Length(1,255)
    description: string

    @IsOptional()
    @IsEnum(RoomStatusType,{
        message:'审批决策不对'
    })
    status: RoomStatusType
}