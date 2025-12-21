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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionHistoryEntity,
      QuestionMetadataEntity,
    ]),
    AdModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionHistoryService, QuestionMetadataService],
  exports: [QuestionService],
})
export class QuestionModule {}
