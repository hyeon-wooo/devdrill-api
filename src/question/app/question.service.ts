import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { FindOptionsWhere, In, IsNull, Repository } from 'typeorm';
import { QuestionEntity } from '../infra/question.entity';
import * as fs from 'fs';
import { QuestionHistoryService } from './question-history.service';
import { EQuestionAction } from '../domain/question.enum';

@Injectable()
export class QuestionService extends CRUDService<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity) repo: Repository<QuestionEntity>,
    private readonly questionHistoryService: QuestionHistoryService,
  ) {
    super(repo);
  }

  async bulkInsert() {
    const json = fs.readFileSync('data/saa.json', 'utf8');
    const questions = JSON.parse(json);
    for (const question of questions) {
      await this.create(question);
    }
  }

  async getRandomQuestion(
    userId: number,
    categoryId: number,
    canReadAll: boolean,
    ignoreAlreadySolved: boolean,
  ) {
    const condition: FindOptionsWhere<QuestionEntity> = {
      categoryId,
    };
    // '모든문제읽기가능' 사용자가 아닌 경우 프리미엄 문제 제외
    if (!canReadAll) condition.isPremium = false;

    let questions = await this.findMany({
      where: condition,
    });

    if (ignoreAlreadySolved) {
      const alreadySolvedQuestions = await this.questionHistoryService.findMany(
        {
          where: {
            userId,
            isCorrect: true,
          },
        },
      );

      questions = questions.filter(
        (question) =>
          !alreadySolvedQuestions.some((q) => q.questionId === question.id),
      );
    }
    if (questions.length === 0) return -1;

    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];

    this.questionHistoryService.create({
      userId,
      questionId: q.id,
    });

    return {
      id: q.id,
      questionNumber: q.questionNumber,
      content: q.content,
      choiceA: q.choiceA,
      choiceB: q.choiceB,
      choiceC: q.choiceC,
      choiceD: q.choiceD,
      choiceE: q.choiceE,
      isMultiple: q.answer.includes(','),
      maxChoices: q.answer.split(',').length,
    };
  }

  async submitQuestion(userId: number, questionId: number, myAnswer: string) {
    const question = await this.findOne({ id: questionId });
    if (!question) throw new NotFoundException('문제를 찾을 수 없습니다.');

    const sortedAnswer = question.answer.split(', ').sort().join(', ');
    const isCorrect = question.answer === sortedAnswer;

    await this.questionHistoryService.create({
      userId,
      questionId,
      action: EQuestionAction.SUBMIT,
      choicedAnswer: sortedAnswer,
      isCorrect,
    });

    return {
      isCorrect,
      answer: question.answer,
      explanation: question.explanation,
    };
  }

  async resetHistory(userId: number, categoryId: number) {
    const ids = await this.findMany({
      select: ['id'],
      where: {
        categoryId,
      },
    });

    await this.questionHistoryService.deleteWithWhere({
      userId,
      questionId: In(ids.map((id) => id.id)),
    });

    return true;
  }

  async getSolvedCount(userId: number, categoryId: number) {
    const ids = await this.findMany({
      select: ['id'],
      where: {
        categoryId,
      },
    });

    const solvedHistories = await this.questionHistoryService.findMany({
      select: ['id'],
      where: {
        userId,
        questionId: In(ids.map((id) => id.id)),
        isCorrect: true,
      },
    });

    return solvedHistories.length;
  }
}
