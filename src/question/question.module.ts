import { Module } from '@nestjs/common';
import { QuestionController } from './interface/question.controller';
import { QuestionService } from './app/question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './infra/question.entity';
import { QuestionHistoryEntity } from './infra/question-history.entity';
import { QuestionHistoryService } from './app/question-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, QuestionHistoryEntity])],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionHistoryService],
  exports: [QuestionService],
})
export class QuestionModule {}
