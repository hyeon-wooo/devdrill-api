import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from '../admin/admin.module';
import { BatchService } from './batch.service';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    AdminModule,
    QuestionModule,
  ],
  providers: [BatchService],
})
export class BatchModule {}
