import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeController } from './serve.controller';
import { ServeService } from './serve.service';
import { Serve } from './serve.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Serve])],
  providers: [ServeService],
  controllers: [ServeController],
  exports: [ServeService],
})
export class ServeModule {}
