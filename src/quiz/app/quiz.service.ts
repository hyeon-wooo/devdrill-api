import { Injectable } from '@nestjs/common';
import { QuizRepository } from '../infra/quiz/quiz.repository';
import { QuizAttachmentRepository } from '../infra/attachment/quiz-attachment.repository';
import { QuizCommandRepository } from '../infra/command/quiz-command.repository';
import { QuizBookmarkRepository } from '../infra/bookmark/quiz-bookmark.repository';
import { QuizDifficultRepository } from '../infra/difficult/quiz-difficult.repository';
import { QuizEnterHistoryRepository } from '../infra/history/quiz-enter-history.repository';
import { QuizSubmitHistoryRepository } from '../infra/history/quiz-submit-history.repository';

@Injectable()
export class QuizService {
  constructor(
    private readonly repo: QuizRepository,
    private readonly attachmentRepo: QuizAttachmentRepository,
    private readonly commandRepo: QuizCommandRepository,
    private readonly bookmarkRepo: QuizBookmarkRepository,
    private readonly difficultRepo: QuizDifficultRepository,
    private readonly enterHistoryRepo: QuizEnterHistoryRepository,
    private readonly submitHistoryRepo: QuizSubmitHistoryRepository,
  ) {}
}
