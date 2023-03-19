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

@Entity('property_real_estate_room')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column()
  zone: string;

  @Column()
  name: string;

  @Column()
  status: RoomStatusType;

  @Column()
  area: Number;

  @Column()
  description: string;

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

@ManyToMany(type => User)
@JoinTable({
    name: "property_real_estate_room__property_real_estate_user",
    joinColumn: {
        name: "room_id",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "user_id",
        referencedColumnName: "id"
    }
})
users: User[];
}
