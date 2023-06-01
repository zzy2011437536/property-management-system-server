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
import { v4 as uuidv4 } from 'uuid';

export enum Role {
  laotou = 1,
  laotouzinv = 2,
  fuwurenyuan = 3,
  yiliaorenyuan = 4,
  admin = 5,
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_name',
  })
  userName: string;

  @Column()
  contact: string;

  @Column()
  role: number;

  @Column()
  password: string;

  @Column()
  ticket: string;

  @BeforeInsert()
  insert() {
    this.ticket = uuidv4();
  }
}
