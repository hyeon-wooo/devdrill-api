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
import {
  CreateQuestionBodyDto,
  UpdateQuestionBodyDto,
} from '../interface/question.dto';
import { QuestionMetadataService } from './question-metadata.service';

@Injectable()
export class QuestionService extends CRUDService<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity) repo: Repository<QuestionEntity>,
    private readonly questionHistoryService: QuestionHistoryService,
    private readonly metadataService: QuestionMetadataService,
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

  async getMetadata(questionId: number) {
    return this.metadataService.findMany({
      where: { questionId },
      relations: {
        image: true,
      },
    });
  }

  async getRandomQuestion(
    userId: number,
    examId: number,
    canReadAll: boolean,
    ignoreAlreadySolved: boolean,
  ) {
    const condition: FindOptionsWhere<QuestionEntity> = {
      examId,
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
      const distinctSolvedQuestionIds = [
        ...new Set(alreadySolvedQuestions.map((q) => q.questionId)),
      ];
      if (distinctSolvedQuestionIds.length < questions.length)
        questions = questions.filter(
          (question) => !distinctSolvedQuestionIds.includes(question.id),
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
      choiceF: q.choiceF,
      topic: q.topic,
      isMultiple: q.answer.includes(','),
      maxChoices: q.answer.split(',').length,
    };
  }

  async submitQuestion(userId: number, questionId: number, myAnswer: string) {
    const question = await this.findOne({ id: questionId });
    if (!question) throw new NotFoundException('문제를 찾을 수 없습니다.');

    const sortedAnswer = myAnswer.split(', ').sort().join(', ');
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
      topic: question.topic,
      explanation: question.explanation,
      explanation2: question.explanation2,
      explanation3: question.explanation3,
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

  async getSolvedCount(userId: number, examId: number) {
    const ids = await this.findMany({
      select: ['id'],
      where: {
        examId,
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

    const distinctSolvedCount = new Set(
      solvedHistories.map((history) => history.id),
    ).size;

    return Math.min(distinctSolvedCount, ids.length);
  }

  async createQuestion(body: CreateQuestionBodyDto) {
    const { metadata, ...rest } = body;
    const created = await this.create({
      ...rest,
      hasMetadata: metadata.length > 0,
    });
    await this.metadataService.create(
      metadata.map((m) => ({ ...m, questionId: created[0].id })),
    );
    return created[0];
  }

  async updateQuestion(id: number, body: UpdateQuestionBodyDto) {
    const found = await this.findOne({ id });
    if (!found) return false;

    const { metadata, ...rest } = body;
    Object.assign(found, { ...rest, hasMetadata: metadata.length > 0 });

    await this.save([found]);

    await this.metadataService.deleteWithWhere({ questionId: id });
    await this.metadataService.create(
      metadata.map((m) => ({ ...m, questionId: id })),
    );

    return true;
  }
}
