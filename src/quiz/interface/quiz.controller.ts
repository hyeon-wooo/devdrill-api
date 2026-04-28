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
import { QuizService } from '../app/quiz.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import {
  HistoryListQueryDto,
  QuizListQueryDto,
  SubmitQuizBodyDto,
} from './quiz.dto';
import { Request } from 'express';
import { SessionId } from 'src/log/app/session-id.decorator';
import { EQuizEnterMethod } from '../domain/quiz.enum';

@Controller('quiz')
export class QuizController {
  constructor(private readonly service: QuizService) {}

  // 목록 조회
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getList(@Req() { user }: Request, @Query() query: QuizListQueryDto) {
    const list = await this.service.getList({
      techId: Number(query.techId),
      userId: user!.id,
      onlyBookmarked: query.onlyBookmarked === 'y',
    });

    return sendSuccessRes({
      list,
    });
  }

  @Get('/main')
  @UseGuards(JwtAuthGuard)
  async getMain(@Req() { user }: Request, @Query() query: { techId: string }) {
    const result = await this.service.getMain({
      userId: user!.id,
      techId: Number(query.techId),
    });

    return sendSuccessRes(result);
  }

  // 상세 조회 (랜덤)
  @Get('/random')
  @UseGuards(JwtAuthGuard)
  async getRandom(
    @Req() { user }: Request,
    @SessionId() sessionId: string,
    @Query() query: { techId: string },
  ) {
    const result = await this.service.getRandom(Number(query.techId), {
      userId: user!.id,
      sessionId,
    });

    return sendSuccessRes(result); // {quiz, isBookmarked, isDifficult, needShowAd}
  }

  // 풀이이력 목록
  @Get('/history')
  @UseGuards(JwtAuthGuard)
  async getHistoryList(
    @Query() query: HistoryListQueryDto,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const list = await this.service.getHistoryList(query, {
      userId: user!.id,
      sessionId,
    });
    return sendSuccessRes({ list });
  }

  // 풀이이력 상세
  @Get('/history/:id')
  @UseGuards(JwtAuthGuard)
  async getHistoryDetail(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const id = Number(idStr);
    if (isNaN(id)) return sendFailRes('잘못된 요청입니다.');

    const result = await this.service.getHistoryDetail(id, {
      userId: user!.id,
      sessionId,
    });
    if (!result) return sendFailRes('접근할 수 없는 이력입니다.');

    return sendSuccessRes(result);
  }

  // 상세 조회 (특정)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getDetail(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @Query() query: { method: EQuizEnterMethod },
    @SessionId() sessionId: string,
  ) {
    const id = Number(idStr);
    if (isNaN(id)) return sendFailRes('잘못된 요청입니다.');

    const result = await this.service.getDetail(id, {
      userId: user!.id,
      sessionId,
      method: query.method,
    });

    if (!result?.quiz) return sendFailRes('접근할 수 없는 문제입니다.');

    return sendSuccessRes(result);
  }

  // 해설 조회
  @Get('/:id/explanation')
  @UseGuards(JwtAuthGuard)
  async getExplanation(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const id = Number(idStr);
    const result = await this.service.getExplanation(id, {
      userId: user!.id,
      sessionId,
    });

    return sendSuccessRes(result);
  }

  // 채점
  @Post('/:id/submit')
  @UseGuards(JwtAuthGuard)
  async submit(
    @Param('id') idStr: string,
    @Body() body: SubmitQuizBodyDto,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const result = await this.service.submit(Number(idStr), {
      myAnswer: body.myAnswer,
      takenSeconds: body.takenSeconds,
      userId: user!.id,
      sessionId,
    });
    return sendSuccessRes(result);
  }

  // 북마크 추가/제거
  @Post('/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmark(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const userId = user!.id;
    const result = await this.service.bookmark(
      Number(idStr),
      userId,
      sessionId,
    );
    return sendSuccessRes({ bookmarked: result });
  }
}
