import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/user/guards/is-admin.guard';
import { RoomListDto } from './dto/room-list.dto';
import { UpdateRoomInfoDto } from './dto/update-room-info-dto';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import { RoomService } from './services/room.service';
import { User } from 'src/user/entities/user.entity';
@Controller('/room')
export class RoomController {
  @Inject(RoomService)
  protected readonly service: RoomService;

  @Post('/addRoom')
  async addRoom(): Promise<any> {
    return this.service.addRoom();
  }

  @Post('/updateInfo')
  async updateInfo(
    @Body() updateRoomInfoDto: UpdateRoomInfoDto,
  ): Promise<Room> {
    return this.service.updateInfo(updateRoomInfoDto);
  }

  @Post('/getRoomList')
  async getRoomList(@Body() roomListDto: RoomListDto): Promise<Room[]> {
    return this.service.getRoomList(roomListDto);
  }

  @Post('/getRoomListBySelf')
  async getRoomListBySelf(): Promise<Room[]> {
    return this.service.getRoomListBySelf();
  }

  @Post('/getRoomInfo')
  async getRoomInfo(@Body('id') id: number): Promise<Room> {
    return this.service.getRoomInfo(id);
  }

  @Post('/addUserInRoom')
  async addUserInRoom(
    @Body('userList') userList: string[],
    @Body('roomId') roomId: number,
  ): Promise<void> {
    return this.service.addUserInRoom(roomId, userList);
  }

  @Post('/delUserInRoom')
  async delUserInRoom(
    @Body('userId') userId: number,
    @Body('roomId') roomId: number,
  ): Promise<void> {
    return this.service.delUserInRoom(roomId, userId);
  }

  @Post('/getUserListFormAddUserInRoom')
  async getUserListFormAddUserInRoom(
    @Body('userName') userName: string,
    @Body('roomId') roomId: number,
  ): Promise<User[]> {
    return this.service.getUserListFormAddUserInRoom(userName, roomId);
  }

  @Post('/changePaymentStatus')
  async changePaymentStatus(@Body('roomId') roomId: number): Promise<void> {
    return this.service.changePaymentStatus(roomId);
  }
}
