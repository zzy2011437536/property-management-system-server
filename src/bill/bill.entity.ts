import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

export enum BillType {
  tool = 1, //维修
  env = 2, //保洁
  parkingCharge = 3, //停车收费
}

@Entity('property_real_eastate_bill')
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'entity_id',
  })
  @Transform(({ value }) => Number(value))
  entityId: number;

  @Column()
  type: BillType;
}
