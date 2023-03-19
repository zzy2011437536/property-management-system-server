import {
    BaseEntity,
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
  } from 'typeorm';
  import { Transform } from 'class-transformer';
  import * as moment from 'moment';
  import { User } from 'src/user/entities/user.entity';
  
  export enum RoomStatusType {
    saling = 0, // 出售中
    pendingCheckIn = 1, //待入住
    haveCheckedIn = 2, //已入住
  }
  
  export enum RoomZoneType {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
  }
  
  @Entity('property_real_estate_room__property_real_estate_user')
  export class RoomUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Transform(({ value }) => Number(value))
    id: number;
  
    @Column({
        name:'user_id'
    })
    userId: number;
  
    @Column({
        name:'room_id'
    })
    roomId: number;
  }
  