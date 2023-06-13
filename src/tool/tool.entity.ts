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
  ElectricalMaintenance = 1, //电器维修
  PipelineMaintenance = 2, //管道维修
  WoodworkingMaintenance = 3, //木工维修
  PaintRepair = 4, //油漆维修
  FurnitureMaintenance = 5, //家具维修
  LightingMaintenance = 6, //灯具维修
}

export const AmountMap = {
  [ToolType.ElectricalMaintenance]: 100,
  [ToolType.PipelineMaintenance]: 120,
  [ToolType.WoodworkingMaintenance]: 50,
  [ToolType.PaintRepair]: 100,
  [ToolType.FurnitureMaintenance]: 50,
  [ToolType.LightingMaintenance]: 100,
};

export const vipLevel = {
  v1: 1,
  v2: 0.9,
  v3: 0.8,
};

export const ToolTypeMap = {
  [ToolType.ElectricalMaintenance]: '电器维修',
  [ToolType.PipelineMaintenance]: '管道维修',
  [ToolType.WoodworkingMaintenance]: '木工维修',
  [ToolType.PaintRepair]: '油漆维修',
  [ToolType.FurnitureMaintenance]: '家具维修',
  [ToolType.LightingMaintenance]: '灯具维修',
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
  content: string;
  @Column()
  description: string;

  @Column()
  evaluation: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  createdAt: Date;

  @Column({
    name: 'bill_number',
  })
  billNumber: string;

  @Column()
  state: number;

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
