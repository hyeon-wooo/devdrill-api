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
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { RandomQuestionQueryDto, SubmitQuestionBodyDto } from './question.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { IJwtPayload } from 'src/auth/auth.interface';
import { QuestionHistoryService } from '../app/question-history.service';
import { AdService } from 'src/ad/app/ad.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly questionHistoryService: QuestionHistoryService,
    private readonly adService: AdService,
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
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const question = await this.service.getRandomQuestion(
      user.id,
      query.categoryId,
      user.canReadAll,
      query.ignoreAlreadySolved === 'y',
    );

    if (question === -1) return sendFailRes('solved all');

    // 무료플랜 사용자만 광고 표시
    const needAd = user.canSkipAd
      ? false
      : await this.adService.needShowAd(user.id);

    return sendSuccessRes({ question, needAd });
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
    @Body() body: { categoryId: number },
    @Req() { user }: Request,
  ) {
    const { categoryId } = body;
    const userId = user?.id ?? 0;
    await this.service.resetHistory(userId, categoryId);
    return sendSuccessRes(null);
  }
}
