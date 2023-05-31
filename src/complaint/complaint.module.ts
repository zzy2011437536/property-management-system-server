import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './complaint.entity';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint])],
  providers: [ComplaintService],
  controllers: [ComplaintController],
  exports: [ComplaintService],
})
export class ComplaintModule {}
