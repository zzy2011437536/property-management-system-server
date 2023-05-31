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

@Entity('property_real_estate_complaint')
export class Complaint extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column()
  complaint: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  createdAt: Date;
}
