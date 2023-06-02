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

@Entity('activity')
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column()
  type: number;

  @Column()
  time: string;
  @Column()
  addr: string;
  @Column()
  fuze: string;
}
