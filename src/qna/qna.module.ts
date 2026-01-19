import { Module } from '@nestjs/common';
import { QnaController } from './interface/qna.controller';
import { QnaService } from './app/qna.service';
import { QnaEntity } from './infra/qna.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QnaEntity]),
    NotificationModule,
  ],
  controllers: [QnaController],
  providers: [QnaService]
})
export class QnaModule {}
