import { Module } from '@nestjs/common';
import { QuizController } from './interface/quiz.controller';
import { QuizService } from './app/quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './infra/quiz/quiz.entity';
import { QuizCommandEntity } from './infra/command/quiz-command.entity';
import { QuizBookmarkEntity } from './infra/bookmark/quiz-bookmark.entity';
import { QuizAttachmentEntity } from './infra/attachment/quiz-attachment.entity';
import { QuizDifficultEntity } from './infra/difficult/quiz-difficult.entity';
import { QuizEnterHistoryEntity } from './infra/history/quiz-enter-history.entity';
import { QuizSubmitHistoryEntity } from './infra/history/quiz-submit-history.entity';
import { QuizRepository } from './infra/quiz/quiz.repository';
import { QuizAttachmentRepository } from './infra/attachment/quiz-attachment.repository';
import { QuizCommandRepository } from './infra/command/quiz-command.repository';
import { QuizBookmarkRepository } from './infra/bookmark/quiz-bookmark.repository';
import { QuizDifficultRepository } from './infra/difficult/quiz-difficult.repository';
import { QuizEnterHistoryRepository } from './infra/history/quiz-enter-history.repository';
import { QuizSubmitHistoryRepository } from './infra/history/quiz-submit-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      QuizAttachmentEntity,
      QuizCommandEntity,
      QuizBookmarkEntity,
      QuizDifficultEntity,
      QuizEnterHistoryEntity,
      QuizSubmitHistoryEntity,
    ]),
  ],
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizRepository,
    QuizAttachmentRepository,
    QuizCommandRepository,
    QuizBookmarkRepository,
    QuizDifficultRepository,
    QuizEnterHistoryRepository,
    QuizSubmitHistoryRepository,
  ],
  exports: [QuizService],
})
export class QuizModule {}
