import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCode } from 'src/core/constants/error';
import { CustomException } from 'src/core/exceptions/custom.exception';
import { Brackets, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Room, RoomStatusType } from '../entities/room.entity';
import { UpdateRoomInfoDto } from '../dto/update-room-info-dto';
import { RoomListDto } from '../dto/room-list.dto';
import { RoomUser } from '../entities/room-user.entity';
import { User } from 'src/user/entities/user.entity';
import { getClsHookData } from 'src/utils/getClsHookData';
import { vipLevel } from 'src/tool/tool.entity';
import * as moment from 'moment';

const map = new Map([
  [0, 'A'],
  [1, 'B'],
  [2, 'C'],
  [3, 'D'],
]);

@Injectable()
export class RoomService {
  private get vipLevel(): string {
    return getClsHookData('vipLevel');
  }
  @InjectRepository(Room)
  protected readonly repo: Repository<Room>;

  @InjectRepository(RoomUser)
  protected readonly roomUserRepo: Repository<RoomUser>;

  @InjectRepository(User)
  protected readonly userRepo: Repository<User>;

  private get userId(): number {
    return getClsHookData('userId');
  }

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
    const { status, zone, name } = roomListDto;
    const qb = this.repo.createQueryBuilder('room');
    if (status) {
      qb.where('room.status = :status', { status });
    }
    if (zone) {
      qb.andWhere('room.zone = :zone', { zone });
    }
    if (name) {
      const content = `${name}%`;
      qb.andWhere('room.name LIKE :content', { content });
    }
    const data = await qb.getMany();
    return plainToInstance(Room, data);
  }

  async getRoomListBySelf(): Promise<Room[]> {
    //先查用户拥有的房屋
    const userHasRoomInfoList = await this.roomUserRepo.find({
      where: {
        userId: this.userId,
      },
    });
    const userRoomList = userHasRoomInfoList.map((item) => item.roomId);
    if (userRoomList.length === 0) return [];
    const roomList = await this.repo
      .createQueryBuilder('r')
      .where('r.id IN (:...userRoomList)', { userRoomList })
      .getMany();
    return plainToInstance(Room, roomList);
  }

  async getRoomInfo(id: number): Promise<Room> {
    const data = await this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('room.id = :id', { id })
      .getOne();
    return plainToInstance(Room, data);
  }

  async addUserInRoom(roomId: number, userList: string[]): Promise<void> {
    const userInfos = await this.userRepo
      .createQueryBuilder('user')
      .where('user.userName IN (:...userList)', { userList })
      .getMany();
    const userIdList = userInfos.map((item) => item.id);
    const createDataList = userIdList.map((item) => {
      return this.roomUserRepo.create({
        userId: item,
        roomId,
      });
    });
    await this.roomUserRepo.save(createDataList);
    await this.repo.update({ id: roomId }, { status: RoomStatusType.soldOut });
  }

  async delUserInRoom(roomId: number, userId: number) {
    await this.roomUserRepo.delete({
      userId,
      roomId,
    });
    const count = await this.roomUserRepo.count({
      where: {
        roomId,
      },
    });
    if (count === 0) {
      await this.repo.update({ id: roomId }, { status: RoomStatusType.saling });
    }
  }

  async getUserListFormAddUserInRoom(
    userName: string,
    roomId: number,
  ): Promise<User[]> {
    const qb = await this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('room.id = :roomId', { roomId: roomId })
      .getOne();
    const oldUserList = qb.users.map((item) => item.userName);
    const allUserList = [];
    //获取用户列表
    if (userName) {
      const content = `${userName}%`;
      const data = await this.userRepo
        .createQueryBuilder('user')
        .where('user.userName LIKE :content', { content })
        .getMany();
      allUserList.push(...data);
    }
    return allUserList.filter((item) => {
      return !oldUserList.includes(item.userName);
    });
  }

  async changePaymentStatus(roomId: number): Promise<void> {
    const roomInfo = await this.repo.findOne({
      where: { id: roomId },
    });
    const time = moment().format('YYYYMMDD');
    let number = '' + roomId;
    if (+number < 10) {
      number = '000' + number;
    } else if (+number < 100) {
      number = '00' + number;
    } else if (+number < 1000) {
      number = '0' + number;
    }
    const str = time + '2' + number;
    await this.repo.update(roomId, {
      paymentStatus: 1,
      amount: Number(
        Number(roomInfo.area * 12 * vipLevel[this.vipLevel]).toFixed(2),
      ),
      propertyBillingNumber: str,
    });
  }
}
