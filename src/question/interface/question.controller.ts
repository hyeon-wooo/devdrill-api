import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from '../app/question.service';
import { sendSuccessRes } from 'src/common/generateResponse';
import { RandomQuestionQueryDto, SubmitQuestionBodyDto } from './question.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { IJwtPayload } from 'src/auth/auth.interface';
import { QuestionHistoryService } from '../app/question-history.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly questionHistoryService: QuestionHistoryService,
  ) {}

  @Post('/bulk')
  async bulk() {
    await this.service.bulkInsert();
    return sendSuccessRes(null);
  }

  @Get('/random')
  @UseGuards(JwtAuthGuard)
  async getRandom(
    @Query() query: RandomQuestionQueryDto,
    @Req() { user }: Request,
  ) {
    const question = await this.service.getRandomQuestion(
      user?.id ?? 0,
      query.categoryId,
      query.ignoreAlreadySolved === 'y',
    );
    return sendSuccessRes(question);
  }

  @Post('/:id/submit')
  @UseGuards(JwtAuthGuard)
  async submit(
    @Param('id') idStr: string,
    @Body() body: SubmitQuestionBodyDto,
    @Req() { user }: Request,
  ) {
    const userId = user?.id ?? 0;

    const id = Number(idStr);
    const { myAnswer } = body;
    const { answer, explanation, isCorrect } =
      await this.service.submitQuestion(userId, id, myAnswer);
    return sendSuccessRes({ answer, explanation, isCorrect });
  }

  @Post('/history/reset')
  @UseGuards(JwtAuthGuard)
  async resetHistory(
    @Query('categoryId') categoryIdStr: string,
    @Req() { user }: Request,
  ) {
    const categoryId = Number(categoryIdStr);
    const userId = user?.id ?? 0;
    await this.service.resetHistory(userId, categoryId);
    return sendSuccessRes(null);
  }
}
