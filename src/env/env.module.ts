import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvController } from './env.controller';
import { Env } from './env.entity';
import { EnvService } from './env.service';
import { UserModule } from 'src/user/user.module';
import { BillModule } from 'src/bill/bill.module';
import { Bill } from 'src/bill/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Env, Bill]),
    UserModule,
    forwardRef(() => BillModule),
  ],
  providers: [EnvService],
  controllers: [EnvController],
  exports: [EnvService],
})
export class EnvModule {}
