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
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import * as moment from 'moment';
import { Room } from 'src/room/entities/room.entity';

export enum Role {
  resident = 1,
  staff = 2,
  admin = 3,
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
    name: 'contact_information',
  })
  contactInformation: number;

  @Column()
  zone: string;

  @Column({
    name:'room_name',
    default:''
  })
  roomName: string;

  @Column({
    default: Role.resident,
  })
  role: number;

  @Column()
  account: string;

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
  createAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  updatedAt: Date;

  @Exclude()
  @Column('uuid')
  ticket: string;

  @ManyToMany(type => Room)
  @JoinTable({
      name: "property_real_estate_room__property_real_estate_user",
      joinColumn: {
          name: "user_id",
          referencedColumnName: "id"
      },
      inverseJoinColumn: {
          name: "room_id",
          referencedColumnName: "id"
      }
  })
  rooms: Room[];
}
