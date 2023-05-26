import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './bill.controller';
import { Bill } from './bill.entity';
import { BillService } from './bill.service';
import { Env } from 'src/env/env.entity';
import { EnvModule } from 'src/env/env.module';
import { ToolModule } from 'src/tool/tool.module';
import { PCModule } from 'src/parkingCharge/pc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill]),
    forwardRef(() => EnvModule),
    forwardRef(() => ToolModule),
    forwardRef(() => PCModule),
  ],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {}
