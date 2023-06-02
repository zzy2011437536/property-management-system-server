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

@Entity('health')
export class Health extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_name',
  })
  userName: string;
  @Column()
  breath: string;
  @Column()
  rate: string;
  @Column()
  temperature: string;
  @Column()
  lpressure: string;
  @Column()
  hpressure: string;

  @Column()
  state: number;
}
