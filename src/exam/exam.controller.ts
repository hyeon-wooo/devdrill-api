import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtPassGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { QuestionService } from 'src/question/app/question.service';
import { FindOptionsWhere } from 'typeorm';
import { ExamService } from './exam.service';
import { ExamEntity } from './exam.entity';

@Controller('exam')
export class ExamController {
  constructor(
    private readonly service: ExamService,
    private readonly questionService: QuestionService,
  ) {}
  @Get('/')
  @UseGuards(JwtPassGuard)
  async getExams(@Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    // '모든문제읽기가능' 사용자가 아닌 경우 프리미엄 시험 제외
    const examCondition: FindOptionsWhere<ExamEntity> = {};
    if (!user.canReadAll) examCondition.isPremium = false;

    const exams = await this.service.findMany({
      where: examCondition,
    });
    const list: { exam: ExamEntity; solvedCount: number }[] = [];
    for (const exam of exams) {
      if (!user.canReadAll) exam.cntQuestion = exam.cntQuestionGeneral;

      if (!user?.id) {
        list.push({ exam, solvedCount: 0 });
        continue;
      }

      const solvedCount = await this.questionService.getSolvedCount(
        user.id,
        exam.id,
      );
      list.push({ exam, solvedCount });
    }

    console.log('list', list);

    return sendSuccessRes({ list });
  }

  @Get('/all')
  async getAllExams() {
    const exams = await this.service.findMany({
      order: {
        createdAt: 'DESC',
      },
    });
    return sendSuccessRes({ list: exams });
  }
}
