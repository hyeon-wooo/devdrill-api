import { Injectable } from '@nestjs/common';
import { PracticeSetRepository } from '../infrastructure/practice-set/practice-set.repository';
import { PracticeRepository } from '../infrastructure/practice/practice.repository';
import { QuestionService } from 'src/question/app/question.service';
import {
  CreatePracticeBodyDto,
  GetMyPracticesQueryDto,
  SubmitPracticeBodyDto,
} from '../interface/practice.dto';
import {
  EPracticeSelectionCondition,
  EPracticeStatus,
} from '../domain/practice.enum';
import { FindOptionsWhere } from 'typeorm';
import { PracticeEntity } from '../infrastructure/practice/practice.entity';

@Injectable()
export class PracticeService {
  constructor(
    private readonly repo: PracticeRepository,
    private readonly setRepo: PracticeSetRepository,
    private readonly questionService: QuestionService,
  ) {}

  async createPractice(userId: number, body: CreatePracticeBodyDto) {
    const progressPractice = await this.repo.findOne({
      userId: userId,
      status: EPracticeStatus.IN_PROGRESS,
    });
    if (progressPractice) return -1;

    const { examId } = body;
    const questionCount = body.questionCount || 20;
    const selectionCondition =
      body.selectionCondition || EPracticeSelectionCondition.NONE;

    const created = await this.repo.create({
      examId,
      userId,
      selectionCondition,
      questionCount,
    });

    const practiceId = created[0].id;

    // 문제 출제 및 세트 저장
    const questionIds = await this.questionService.getShuffledQuestions({
      userId,
      examId,
      count: questionCount,
      selectionCondition,
    });
    await this.setRepo.create(
      questionIds.map((questionId, index) => ({
        practiceId,
        questionId,
        sequence: index + 1,
      })),
    );

    return created[0];
  }

  async getQuestions(practiceId: number) {
    const questionSet = await this.setRepo.findMany({
      where: {
        practiceId,
      },
      relations: {
        question: {
          metadata: true,
        },
      },
      order: {
        sequence: 'ASC',
      },
    });

    return questionSet.map(({ question }) => {
      return {
        id: question.id,
        content: question.content,
        choiceA: question.choiceA,
        choiceB: question.choiceB,
        choiceC: question.choiceC,
        choiceD: question.choiceD,
        choiceE: question.choiceE,
        choiceF: question.choiceF,
        metadata: question.metadata,
      };
    });
  }

  async submitPractice(options: {
    practiceId: number;
    userId: number;
    answers: string[];
    isCancelled: boolean;
  }) {
    const { practiceId, userId, answers, isCancelled } = options;
    if (isCancelled) {
      await this.repo.update(
        { id: practiceId },
        {
          status: EPracticeStatus.CANCELLED,
          endAt: new Date(),
        },
      );
      return;
    }

    const questionSet = await this.setRepo.findMany({
      where: {
        practiceId,
      },
      relations: {
        question: true,
      },
      order: {
        sequence: 'ASC',
      },
    });

    // 채점
    let correctCount = 0;
    for (let i = 0; i < questionSet.length; i++) {
      const { question, id } = questionSet[i];

      const choicedAnswer = answers[i].split(', ').sort().join(', ');
      const isCorrect = question.answer === choicedAnswer;
      if (isCorrect) correctCount++;

      await this.setRepo.update(
        { id },
        {
          isCorrect,
          choicedAnswer,
        },
      );
    }

    // 모의고사 종료 처리
    await this.repo.update(
      { id: practiceId },
      {
        status: EPracticeStatus.COMPLETED,
        correctCount,
        endAt: new Date(),
      },
    );

    return {
      correctCount,
      totalCount: questionSet.length,
    };
  }

  async getList(query: GetMyPracticesQueryDto, userId: number) {
    const condition: FindOptionsWhere<PracticeEntity> = { userId };
    if (query.examId) condition.examId = Number(query.examId);

    const practices = await this.repo.findMany({
      where: condition,
      order: {
        createdAt: 'DESC',
      },
      skip: Number(query.from),
      take: Number(query.limit),
      relations: {
        exam: true,
      },
    });

    const result: { list: PracticeEntity[]; totalCount?: number } = {
      list: practices,
    };
    if (query.needTotalCount) {
      const totalCount = await this.repo.count(condition);
      result.totalCount = totalCount;
    }

    return result;
  }
}
