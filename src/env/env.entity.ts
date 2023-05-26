import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';

export enum EnvType {
  HouseholdCleaning = 1, //家庭清洁服务
  CookingService = 2, //烹饪服务
  HomeMaintenanceService = 3, //家居维护服务
  PurchasingService = 4, //代购服务
  BabysittingService = 5, //保姆服务
  PetCareService = 6, //宠物照顾服务
}

export const AmountMap = {
  [EnvType.HouseholdCleaning]: 150,
  [EnvType.CookingService]: 50,
  [EnvType.HomeMaintenanceService]: 100,
  [EnvType.PurchasingService]: 50,
  [EnvType.BabysittingService]: 200,
  [EnvType.PetCareService]: 100,
};

@Entity('property_real_eastate_env')
export class Env extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'room_id',
  })
  roomId: number;

  @Column()
  type: EnvType;

  @Column({
    name: 'toll_gatherer_id',
  })
  tollGathererId: number;

  @Column()
  amount: number;

  @Column()
  evaluation: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.envs)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;

  @ManyToOne((type) => User, (user) => user.envs)
  @JoinColumn({ referencedColumnName: 'id', name: 'toll_gatherer_id' })
  tollGatherer: User;

  @ManyToOne((type) => Room, (room) => room.envs)
  @JoinColumn({ referencedColumnName: 'id', name: 'room_id' })
  room: Room;
}
