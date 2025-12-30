import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { In, Repository } from 'typeorm';
import { QuestionHistoryEntity } from '../infra/question-history.entity';

@Injectable()
export class QuestionHistoryService extends CRUDService<QuestionHistoryEntity> {
  constructor(
    @InjectRepository(QuestionHistoryEntity)
    repo: Repository<QuestionHistoryEntity>,
  ) {
    super(repo);
  }

  async getWrongQuestionIds(options: {
    userId: number;
    questionIds: number[];
    count?: number;
  }) {
    const wrongHistories = await this.findMany({
      where: {
        userId: options.userId,
        questionId: In(options.questionIds),
        isCorrect: false,
      },
    });

    const wrongCountMap = wrongHistories.reduce((acc, cur) => {
      acc.set(cur.questionId, (acc.get(cur.questionId) || 0) + 1);
      return acc;
    }, new Map<number, number>());

    const sortedWrongCount = Array.from(wrongCountMap.entries()).sort(
      (a, b) => b[1] - a[1],
    );

    const selectedQuestionIds = sortedWrongCount
      .slice(0, options.count || sortedWrongCount.length)
      .map(([questionId]) => questionId);

    return selectedQuestionIds;
  }
}
