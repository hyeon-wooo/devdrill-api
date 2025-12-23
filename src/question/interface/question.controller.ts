import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from '../app/question.service';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import {
  CreateQuestionBodyDto,
  QuestionListItemDto,
  QuestionListQueryDto,
  RandomQuestionQueryDto,
  SubmitQuestionBodyDto,
  UpdateQuestionBodyDto,
} from './question.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { IJwtPayload } from 'src/auth/auth.interface';
import { QuestionHistoryService } from '../app/question-history.service';
import { AdService } from 'src/ad/app/ad.service';
import { FindManyOptions, FindOptionsWhere, Like } from 'typeorm';
import { QuestionEntity } from '../infra/question.entity';

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

  @Get('/')
  async getList(@Query() query: QuestionListQueryDto) {
    const condition: FindOptionsWhere<QuestionEntity> = {};
    if (query.categoryId) {
      condition.categoryId = Number(query.categoryId);
    }

    if (query.searchKeyword) {
      switch (query.searchField) {
        case 'id':
        case 'questionNumber':
          const num = Number(query.searchKeyword);
          if (!isNaN(num)) condition[query.searchField] = num;
          break;
        default:
          condition[query.searchField ?? 'topic'] = Like(
            `%${query.searchKeyword}%`,
          );
      }
    }

    const options: FindManyOptions<QuestionEntity> = {
      where: condition,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        category: true,
      },
    };

    if (query.from) options.skip = query.from;
    if (query.limit) options.take = query.limit;

    const projects = await this.service.findMany(options);

    const responseData: {
      list: QuestionListItemDto[];
      totalCount?: number;
    } = {
      list: projects.map((question) => new QuestionListItemDto(question)),
    };

    if (query.needTotalCount) {
      const totalCount = await this.service.count(condition);
      responseData.totalCount = totalCount;
    }

    return sendSuccessRes(responseData);
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
      query.ignoreAlreadySolved ? query.ignoreAlreadySolved === 'y' : true,
    );

    if (question === -1) return sendFailRes('solved all');

    const metadata = await this.service.getMetadata(question.id);

    // 무료플랜 사용자만 광고 표시
    const needAd = user.canSkipAd
      ? false
      : await this.adService.needShowAd(user.id);

    return sendSuccessRes({ question, metadata, needAd });
  }

  @Get('/:id')
  async getDetail(@Param('id') idStr: string) {
    const id = Number(idStr);
    const question = await this.service.findOne(
      { id },
      {
        category: true,
        metadata: { image: true },
      },
    );
    if (!question) return sendFailRes('접근할 수 없는 문제입니다.');

    return sendSuccessRes({ question });
  }

  @Post('/')
  async createQuestion(@Body() body: CreateQuestionBodyDto) {
    const created = await this.service.createQuestion(body);
    return sendSuccessRes({ id: created.id });
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
    const {
      answer,
      topic,
      explanation,
      explanation2,
      explanation3,
      isCorrect,
    } = await this.service.submitQuestion(userId, id, myAnswer);
    return sendSuccessRes({
      answer,
      topic,
      explanation,
      explanation2,
      explanation3,
      isCorrect,
    });
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

  @Put('/:id')
  async updateQuestion(
    @Param('id') idStr: string,
    @Body() body: UpdateQuestionBodyDto,
  ) {
    const id = Number(idStr);
    await this.service.updateQuestion(id, body);
    return sendSuccessRes(true);
  }
}
