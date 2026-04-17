import { Module } from '@nestjs/common';
import { QuestionController } from './interface/question.controller';
import { QuestionService } from './app/question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './infra/question.entity';
import { QuestionHistoryEntity } from './infra/question-history.entity';
import { QuestionHistoryService } from './app/question-history.service';
import { AdModule } from 'src/ad/ad.module';
import { QuestionMetadataEntity } from './infra/question-metadata.entity';
import { QuestionMetadataService } from './app/question-metadata.service';
import { QuestionBookmarkEntity } from './infra/question-bookmark.entity';
import { QuestionBookmarkService } from './app/question-bookmark.service';

/** @deprecated QuizModule로 재구성 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionHistoryEntity,
      QuestionMetadataEntity,
      QuestionBookmarkEntity,
    ]),
    AdModule,
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionHistoryService,
    QuestionMetadataService,
    QuestionBookmarkService,
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
