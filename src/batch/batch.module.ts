import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from '../admin/admin.module';
import { BatchService } from './batch.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, AdminModule],
  providers: [BatchService],
})
export class BatchModule {}
