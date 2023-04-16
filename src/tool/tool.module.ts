import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolController } from './tool.controller';
import { Tool } from './tool.entity';
import { ToolService } from './tool.service';
import { UserModule } from 'src/user/user.module';
import { BillModule } from 'src/bill/bill.module';
import { Bill } from 'src/bill/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tool, Bill]),
    UserModule,
    forwardRef(() => BillModule),
  ],
  providers: [ToolService],
  controllers: [ToolController],
  exports: [ToolService],
})
export class ToolModule {}
