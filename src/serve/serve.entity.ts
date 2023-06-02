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

@Entity('serve')
export class Serve extends BaseEntity {
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
  amount: string;

  @Column()
  description: string;

  @Column()
  rate: string;

  @Column()
  time: string;
  @Column()
  evation: string;
  @Column()
  fuze: string;
}
