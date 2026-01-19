import {
  Body,
  Controller,
  Delete,
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
  QuestionExploreQueryDto,
  QuestionListItemDto,
  QuestionListQueryDto,
  QuestionQuizResponseDto,
  RandomQuestionQueryDto,
  SubmitQuestionBodyDto,
  UpdateQuestionBodyDto,
} from './question.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { IJwtPayload } from 'src/auth/auth.interface';
import { QuestionHistoryService } from '../app/question-history.service';
import { AdService } from 'src/ad/app/ad.service';
import { FindManyOptions, FindOptionsWhere, In, Like } from 'typeorm';
import { QuestionEntity } from '../infra/question.entity';
import { EQuestionAction, EQuestionQuizMode } from '../domain/question.enum';
import { QuestionBookmarkService } from '../app/question-bookmark.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly questionHistoryService: QuestionHistoryService,
    private readonly adService: AdService,
    private readonly bookmarkService: QuestionBookmarkService,
  ) {}

  @Post('/bulk')
  async bulk() {
    await this.service.bulkInsert();
    return sendSuccessRes(null);
  }

  @Get('/')
  async getList(@Query() query: QuestionListQueryDto) {
    const condition: FindOptionsWhere<QuestionEntity> = {};
    if (query.examId) {
      if (query.examId) condition.examId = Number(query.examId);
    }
    if (query.subjectId) {
      if (query.subjectId) condition.subjectId = Number(query.subjectId);
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
        exam: true,
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
      query.examId,
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

  @Get('/explore')
  @UseGuards(JwtAuthGuard)
  async explore(
    @Req() { user }: Request,
    @Query() query: QuestionExploreQueryDto,
  ) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const condition: FindOptionsWhere<QuestionEntity> = {
      examId: query.examId,
    };

    if (query.onlyBookmarked === 'y') {
      const bookmarks = await this.bookmarkService.findMany({
        where: { userId: user.id, examId: query.examId },
        relations: { question: true },
        order: { createdAt: 'DESC' },
      });
      const bookmarkedQuestionIds = bookmarks.map(b => b.questionId)
      condition.id = In(bookmarkedQuestionIds)
    }

    // '모든문제읽기가능' 사용자가 아닌 경우 프리미엄 문제 제외
    if (!user.canReadAll) condition.isPremium = false;

    const questions = await this.service.findMany({
      where: condition,
      order: { questionNumber: 'ASC' },
      skip: Number(query.from),
      take: Number(query.limit),
    });

    const questionIds = questions.map((question) => question.id);

    const correctMap = await this.service.getCorrectMap(questionIds, user.id);
    const bookmarkMap = await this.bookmarkService.getBookmarkMap(questionIds, user.id);

    const questionExploreItems = questions.map((q) => {
      const isCorrect = correctMap[q.id] ?? false;
      const isBookmarked = bookmarkMap[q.id] ?? false;
      const { questionNumber, topic, id } = q;
      return {
        questionNumber,
        topic,
        id,
        isCorrect,
        isBookmarked,
      };
    });

    return sendSuccessRes({ list: questionExploreItems });
  }

  @Get('/explore/:id')
  @UseGuards(JwtAuthGuard)
  async getExploreDetail(@Param('id') idStr: string, @Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const id = Number(idStr);
    const question = await this.service.findOne(
      { id },
      { metadata: { image: true } },
    );
    if (!question) return sendFailRes('접근할 수 없는 문제입니다.');

    // 무료플랜 사용자만 광고 표시
    const needAd = user.canSkipAd
      ? false
      : await this.adService.needShowAd(user.id);

    this.service.createHistory({
      userId: user.id,
      questionId: id,
      action: EQuestionAction.ENTER,
      quizMode: EQuestionQuizMode.EXPLORE,
    });

    return sendSuccessRes({
      question: new QuestionQuizResponseDto(question),
      metadata: question.metadata,
      needAd,
    });
  }

  @Get('/:id')
  async getDetail(@Param('id') idStr: string) {
    const id = Number(idStr);
    const question = await this.service.findOne(
      { id },
      {
        exam: true,
        metadata: { image: true },
      },
    );
    if (!question) return sendFailRes('접근할 수 없는 문제입니다.');

    return sendSuccessRes({ question });
  }

  @Get('/:id/explanation')
  async getExplanation(@Param('id') idStr: string) {
    const id = Number(idStr);
    const question = await this.service.findOne({ id });
    if (!question) return sendFailRes('접근할 수 없는 문제입니다.');

    return sendSuccessRes({
      answer: question.answer,
      topic: question.topic,
      explanation: question.explanation,
      explanation2: question.explanation2,
      explanation3: question.explanation3,
    });
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
    const { myAnswer, quizMode } = body;
    const {
      answer,
      topic,
      explanation,
      explanation2,
      explanation3,
      isCorrect,
    } = await this.service.submitQuestion(userId, id, myAnswer, quizMode);
    return sendSuccessRes({
      answer,
      topic,
      explanation,
      explanation2,
      explanation3,
      isCorrect,
    });
  }

  @Post('/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  async createBookmark(@Param('id') idStr: string, @Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');
    const question = await this.service.findOne({ id: Number(idStr) });
    if (!question || !question.examId) return sendFailRes('접근할 수 없는 문제입니다.');

    const already = await this.bookmarkService.findOne({ questionId: question.id, userId: user.id });
    if (already) return sendSuccessRes(true);

    await this.bookmarkService.create({
      userId: user.id,
      questionId: question.id,
      examId: question.examId,
    });
    return sendSuccessRes(true);
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

  @Delete('/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(@Param('id') idStr: string, @Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');

    const id = Number(idStr);

    await this.bookmarkService.deleteWithWhere({ questionId: id, userId: user.id });
    
    return sendSuccessRes(true);
  }
}
