import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { sendSuccessRes } from 'src/common/generateResponse';
import { JwtPassGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { CategoryEntity } from './category.entity';
import { QuestionService } from 'src/question/app/question.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly questionService: QuestionService,
  ) {}
  @Get('/')
  @UseGuards(JwtPassGuard)
  async getCategories(@Req() { user }: Request) {
    const categories = await this.service.findMany({});
    const list: { category: CategoryEntity; solvedCount: number }[] = [];
    for (const category of categories) {
      if (!user?.id) {
        list.push({ category, solvedCount: 0 });
        continue;
      }
      const solvedCount = await this.questionService.getSolvedCount(
        user.id,
        category.id,
      );
      list.push({ category, solvedCount });
    }
    return sendSuccessRes({ list });
  }
}
