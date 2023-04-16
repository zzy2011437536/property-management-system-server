import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Room } from '../entities/room.entity';
import { UpdateRoomInfoDto } from '../dto/update-room-info-dto';
import { IHttpResultPaginate } from 'src/user/services/audit-user.service';
import { RoomListDto } from '../dto/room-list.dto';
import { RoomUser } from '../entities/room-user.entity';

const map = new Map([
  [0, 'A'],
  [1, 'B'],
  [2, 'C'],
  [3, 'D'],
]);
@Injectable()
export class RoomService {
  @InjectRepository(Room)
  protected readonly repo: Repository<Room>;

  @InjectRepository(RoomUser)
  protected readonly roomUserRepo: Repository<RoomUser>;

  async addRoom(): Promise<any> {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 10; j++) {
        for (let k = 1; k < 4; k++) {
          const createData = this.repo.create({
            zone: map.get(i),
            name: `${j}0${k}`,
            area: Number(Number(Math.random() * 30 + 90).toFixed(1)),
            salePrice: Number(Number(Math.random() * 4000 + 15000).toFixed(0)),
          });
          arr.push(createData);
        }
      }
    }

    await this.repo.save(arr);
  }

  async updateInfo(updateRoomInfoDto: UpdateRoomInfoDto): Promise<Room> {
    const { id, description, status } = updateRoomInfoDto;
    const roomData = await this.repo.findOne({ where: { id } });
    if (!roomData) {
      throw new CustomException({
        message: '房屋不存在',
      });
    }
    return plainToInstance(
      Room,
      this.repo.save({
        ...roomData,
        description,
        status,
      }),
    );
  }

  async getRoomList(roomListDto: RoomListDto): Promise<Room[]> {
    const { status, zone } = roomListDto;
    const qb = this.repo.createQueryBuilder('room');
    if (status) {
      qb.where('room.status = :status', { status });
    }
    if (zone) {
      qb.andWhere('room.zone = :zone', { zone });
    }
    const data = await qb.getMany();
    return plainToInstance(Room, data);
  }

  async getRoomInfo(id: number): Promise<Room> {
    return this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('room.id = :id', { id })
      .getOne();
  }

  async addUserInRoom(roomId: number, userId: number) {
    const createData = this.roomUserRepo.create({
      userId,
      roomId,
    });
    return this.roomUserRepo.save(createData);
  }

  async delUserInRoom(roomId: number, userId: number) {
    await this.roomUserRepo.delete({
      userId,
      roomId,
    });
  }
}
