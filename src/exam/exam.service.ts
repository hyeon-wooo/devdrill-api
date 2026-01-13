import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ExamEntity } from './exam.entity';
import { QuestionService } from 'src/question/app/question.service';

@Injectable()
export class ExamService extends CRUDService<ExamEntity> {
  constructor(
    @InjectRepository(ExamEntity) repo: Repository<ExamEntity>,
    private readonly questionService: QuestionService,
  ) {
    super(repo);
  }

  async getExamList(userId: number, canReadAll: boolean) {
    // '모든문제읽기가능' 사용자가 아닌 경우 프리미엄 시험 제외
    const examCondition: FindOptionsWhere<ExamEntity> = {};
    if (!canReadAll) examCondition.isPremium = false;

    const exams = await this.findMany({
      where: examCondition,
    });
    const list: { exam: ExamEntity; solvedCount: number }[] = [];
    for (const exam of exams) {
      if (!canReadAll) exam.cntQuestion = exam.cntQuestionGeneral;

      const solvedCount = await this.questionService.getSolvedCount(
        userId,
        exam.id,
      );
      list.push({ exam, solvedCount });
    }

    return list;
  }

  async getExamProgress(
    id: number,
    options: {
      userId: number;
      canReadAll: boolean;
    },
  ) {
    // 전체 문제 수
    // 맞춘 문제 수
    // 진행률

    const exam = await this.findOne({ id });
    if (!exam) return null;
    const totalQuestionCount = options.canReadAll
      ? exam.cntQuestion
      : exam.cntQuestionGeneral;
    const solvedQuestionCount = await this.questionService.getSolvedCount(
      options.userId,
      id,
    );
    const progress1 = (solvedQuestionCount / totalQuestionCount) * 100;
    const progress =
      progress1 < 99.5 || solvedQuestionCount < totalQuestionCount
        ? Math.round(progress1)
        : 100;

    return {
      totalQuestionCount,
      solvedQuestionCount,
      progress,
    };
  }
}
