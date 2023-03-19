import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator"
import { RoomStatusType, RoomZoneType } from "../entities/room.entity"

export class RoomListDto{
    @IsInt({
        message:'无效的页码'
    })
    page: number

    @IsInt({
        message:'无效的每页数量'
    })
    limit: number

    @IsOptional()
    @IsEnum(RoomStatusType,{
        message:'房屋类型不正确'
    })
    status: RoomStatusType

    @IsOptional()
    @IsEnum(RoomZoneType,{
        message:'房屋区不正确'
    })
    zone: RoomZoneType
}