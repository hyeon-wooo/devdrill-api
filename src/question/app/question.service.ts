import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { In, IsNull, Repository } from 'typeorm';
import { QuestionEntity } from '../infra/question.entity';
import * as fs from 'fs';
import { QuestionHistoryService } from './question-history.service';

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
    ignoreAlreadySolved: boolean,
  ) {
    let questions = await this.findMany({
      where: {
        categoryId,
      },
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
    };
  }

  async submitQuestion(userId: number, questionId: number, myAnswer: string) {
    const question = await this.findOne({ id: questionId });
    if (!question) throw new NotFoundException('문제를 찾을 수 없습니다.');

    const isCorrect = question.answer === myAnswer;

    const history = await this.questionHistoryService.findOne({
      userId,
      questionId,
      choicedAt: IsNull(),
    });

    if (history)
      await this.questionHistoryService.update(
        { id: history.id },
        {
          choicedAt: new Date(),
          choicedAnswer: myAnswer,
          isCorrect,
        },
      );

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
}
