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
  local = 1, //局部
  whole = 2, //整体
}

export const AmountMap = {
  [EnvType.local]: 50,
  [EnvType.whole]: 200,
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
