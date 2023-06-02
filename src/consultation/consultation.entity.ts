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

@Entity('consultation')
export class Consultation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;
  @Column({
    name: 'user_name',
  })
  userName: string;
  @Column()
  desc: string;

  @Column()
  doctor: string;
  @Column()
  order: string;

  @Column({
    name: 'end_time',
  })
  endTime: string;

  @CreateDateColumn()
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD'))
  time: Date;
}
