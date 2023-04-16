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

export enum ToolType {
  hydropower = 1, //水电维修
  householdAppliance = 2, //家电维修
  indoor = 3, //室内维修
}

export const AmountMap = {
  [ToolType.hydropower]: 50,
  [ToolType.householdAppliance]: 100,
  [ToolType.indoor]: 100,
};

export const ToolTypeMap = {
  [ToolType.hydropower]: '水电维修',
  [ToolType.householdAppliance]: '家电维修',
  [ToolType.indoor]: '室内维修',
};

@Entity('property_real_eastate_tool')
export class Tool extends BaseEntity {
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
  type: ToolType;

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

  @ManyToOne((type) => User, (user) => user.tools)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;

  @ManyToOne((type) => User, (user) => user.tools)
  @JoinColumn({ referencedColumnName: 'id', name: 'toll_gatherer_id' })
  tollGatherer: User;

  @ManyToOne((type) => Room, (room) => room.tools)
  @JoinColumn({ referencedColumnName: 'id', name: 'room_id' })
  room: Room;
}
