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
import { PracticeService } from '../app/practice.service';
import {
  CreatePracticeBodyDto,
  GetMyPracticesQueryDto,
  SubmitPracticeBodyDto,
} from './practice.dto';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { FindOptionsWhere } from 'typeorm';
import { PracticeEntity } from '../infra/practice/practice.entity';

@Controller('practice')
export class PracticeController {
  constructor(private readonly service: PracticeService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getMyPractices(
    @Req() { user }: Request,
    @Query() query: GetMyPracticesQueryDto,
  ) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');
    const userId = user.id;

    const { list, totalCount } = await this.service.getList(query, userId);
    return sendSuccessRes({ list, totalCount });
  }

  @Get('/:id/result')
  @UseGuards(JwtAuthGuard)
  async getResult(@Param('id') idStr: string, @Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const id = Number(idStr);
    const practice = await this.service.getResult(id);
    return sendSuccessRes({ practice, needAd: !user.canSkipAd });
  }

  @Get('/:id/question')
  async getQuestions(@Param('id') idStr: string) {
    const id = Number(idStr);
    const questions = await this.service.getQuestions(id);
    return sendSuccessRes({ list: questions });
  }

  // 모의고사에서 틀린 문제 조회
  @Get('/:id/question/wrong')
  @UseGuards(JwtAuthGuard)
  async getWrongQuestions(
    @Param('id') idStr: string,
    @Req() { user }: Request,
  ) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const id = Number(idStr);
    const questions = await this.service.getWrongQuestions(id);
    return sendSuccessRes({ list: questions });
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createPractice(
    @Req() { user }: Request,
    @Body() body: CreatePracticeBodyDto,
  ) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');
    const created = await this.service.createPractice(user.id, body);
    if (created === -1)
      return sendFailRes(
        '이미 진행중인 모의고사를 먼저 완료해주세요.',
        'PRCT0001',
      );

    return sendSuccessRes({ id: created.id });
  }

  @Post('/:id/submit')
  @UseGuards(JwtAuthGuard)
  async submitPractice(
    @Param('id') idStr: string,
    @Body() body: SubmitPracticeBodyDto,
    @Req() { user }: Request,
  ) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');
    const userId = user.id;

    const id = Number(idStr);
    await this.service.submitPractice({
      practiceId: id,
      userId,
      answers: body.answers,
      isCancelled: body.isCancelled,
    });
    return sendSuccessRes(true);
  }
}
