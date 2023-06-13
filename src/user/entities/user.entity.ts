import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import * as moment from 'moment';
import { Room } from 'src/room/entities/room.entity';
import { v4 as uuidv4 } from 'uuid';
import { Tool } from 'src/tool/tool.entity';
import { PC } from 'src/parkingCharge/pc.entity';

export enum Role {
  resident = 1,
  cleaning = 2,
  maintenance = 3,
  admin = 4,
}

export enum StatusType {
  ShutDown = -2, //封停
  applyReject = -1, // 审批拒绝
  normal = 0,
  applying = 1, // 审批中
  success = 2, // 审批通过,可正常使用
}

@Entity('property_real_estate_user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column({
    name: 'vip_level',
  })
  vipLevel: string;

  @Column({
    name: 'contact_information',
  })
  contactInformation: string;

  @Column({
    name: 'subscriber_number',
  })
  subscriberNumber: string;

  @Column({
    default: Role.resident,
  })
  role: number;

  @Column()
  password: string;

  @Column({
    default: StatusType.normal,
  })
  status: StatusType; //账号状态

  @CreateDateColumn({
    name: 'created_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  updatedAt: Date;

  @Column()
  ticket: string;

  @ManyToMany((type) => Room)
  @JoinTable({
    name: 'property_real_estate_room__property_real_estate_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
  })
  rooms: Room[];

  @OneToMany((type) => Tool, (tools) => tools.user)
  tools: Tool[];

  @OneToMany((type) => PC, (parkings) => parkings.user)
  parkings: PC[];

  @BeforeInsert()
  insert() {
    this.ticket = uuidv4();
  }
}
