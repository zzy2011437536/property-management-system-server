import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

export enum AuditType {
  normal = 0,
  changePassword = 1, // 改密码
  forgetPassword = 2, // 忘记密码
  createUser = 3, //注册用户
}

export enum AuditStatus {
    reject = -1, //拒绝
    applying = 0, //审批中
    success = 1 // 审批通过
  }

@Entity('property_real_estate_user_audit')
export class UserAudit extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'audit_type',
  })
  auditType: AuditType;

  @Column({
    name: 'audit_reason',
  })
  auditReason: string;

  @Column({
    name: 'audit_status',
  })
  auditStatus: AuditStatus;

  @Column()
  auditor: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @Transform(({ value }) => moment(value).format('YYYY.MM.DD HH:mm:ss'))
  createAt: Date;
}
