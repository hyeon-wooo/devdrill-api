import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtPassGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { CategoryEntity } from './category.entity';
import { QuestionService } from 'src/question/app/question.service';
import { FindOptionsWhere } from 'typeorm';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly questionService: QuestionService,
  ) {}
  @Get('/')
  @UseGuards(JwtPassGuard)
  async getCategories(@Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    // '모든문제읽기가능' 사용자가 아닌 경우 프리미엄 카테고리 제외
    const categoryCondition: FindOptionsWhere<CategoryEntity> = {};
    if (!user.canReadAll) categoryCondition.isPremium = false;

    const categories = await this.service.findMany({
      where: categoryCondition,
    });
    const list: { category: CategoryEntity; solvedCount: number }[] = [];
    for (const category of categories) {
      const categoryWithCntQuestion = {
        ...category,
        cntQuestion: user.canReadAll
          ? category.cntQuestion + category.cntQuestionPremium
          : category.cntQuestion,
      };
      if (!user?.id) {
        list.push({ category: categoryWithCntQuestion, solvedCount: 0 });
        continue;
      }

      const solvedCount = await this.questionService.getSolvedCount(
        user.id,
        category.id,
      );
      list.push({ category: categoryWithCntQuestion, solvedCount });
    }

    return sendSuccessRes({ list });
  }
}
