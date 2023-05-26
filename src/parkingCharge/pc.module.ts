import { Module, forwardRef } from '@nestjs/common';
import { PC } from './pc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCService } from './pc.service';
import { PCController } from './pc.contronller';
import { BillModule } from 'src/bill/bill.module';
import { UserModule } from 'src/user/user.module';
import { Bill } from 'src/bill/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PC, Bill]),
    UserModule,
    forwardRef(() => BillModule),
  ],
  providers: [PCService],
  controllers: [PCController],
  exports: [PCService],
})
export class PCModule {}
