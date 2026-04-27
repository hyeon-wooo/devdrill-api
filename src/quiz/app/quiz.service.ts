import { Injectable } from '@nestjs/common';
import { QuizRepository } from '../infra/quiz/quiz.repository';
import { QuizAttachmentRepository } from '../infra/attachment/quiz-attachment.repository';
import { QuizCommandRepository } from '../infra/command/quiz-command.repository';
import { QuizBookmarkRepository } from '../infra/bookmark/quiz-bookmark.repository';
import { QuizDifficultRepository } from '../infra/difficult/quiz-difficult.repository';
import { QuizEnterHistoryRepository } from '../infra/history/quiz-enter-history.repository';
import { QuizSubmitHistoryRepository } from '../infra/history/quiz-submit-history.repository';
import * as fs from 'fs';
import * as path from 'path';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
} from 'typeorm';
import { QuizEntity } from '../infra/quiz/quiz.entity';
import { AdService } from 'src/ad/app/ad.service';
import { EQuizEnterMethod } from '../domain/quiz.enum';
import { HistoryListQueryDto } from '../interface/quiz.dto';
import { QuizSubmitHistoryEntity } from '../infra/history/quiz-submit-history.entity';
import { ONE_DAY } from 'src/lib/util';
import { TechService } from 'src/tech/app/tech.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly repo: QuizRepository,
    private readonly attachmentRepo: QuizAttachmentRepository,
    private readonly commandRepo: QuizCommandRepository,
    private readonly bookmarkRepo: QuizBookmarkRepository,
    private readonly difficultRepo: QuizDifficultRepository,
    private readonly enterHistoryRepo: QuizEnterHistoryRepository,
    private readonly submitHistoryRepo: QuizSubmitHistoryRepository,
    private readonly adService: AdService,

    private readonly techService: TechService,
  ) {
    // setTimeout(() => {
    //   this.load();
    // }, 1000);
  }

  async load() {
    const dir = path.join(process.cwd(), 'temp', 'quiz');
    const filepath = path.join(dir, 'kubernetes.json');
    const file = fs.readFileSync(filepath, 'utf-8');
    const quizzes = JSON.parse(file) as any[];

    for (const item of quizzes) {
      const { attachments, commandIds, ...quiz } = item;
      const quizId = (await this.repo.create(quiz))[0].id;
      for (const attachment of attachments) {
        await this.attachmentRepo.create({ ...attachment, quizId });
      }
      for (const commandId of commandIds) {
        await this.commandRepo.create({ quizId, commandId });
      }
    }

    console.log('complete');
  }

  async getMain({ userId, techId }: { userId: number; techId: number }) {
    const histories = await this.submitHistoryRepo.findMany({
      select: ['createdAt', 'isCorrect', 'quizId'],
      where: {
        userId,
        quiz: {
          techId,
        },
      },
      order: { createdAt: 'DESC' },
      relations: { quiz: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthAgo = new Date(today.getTime() - ONE_DAY * 30);

    const todayHistories = histories.filter((h) => h.createdAt >= today);
    const monthHistories = histories.filter((h) => h.createdAt >= monthAgo);

    const todayCorrect = todayHistories.filter((h) => h.isCorrect);
    const monthCorrect = monthHistories.filter((h) => h.isCorrect);
    const totalCorrect = histories.filter((h) => h.isCorrect);

    const tech = await this.techService.getById(techId);
    const cntQuiz = tech?.cntQuiz ?? 0;

    const bookmarks = await this.bookmarkRepo.findMany({
      select: ['id'],
      where: { userId, quiz: { techId } },
      relations: { quiz: true },
    });
    const difficults = await this.difficultRepo.findMany({
      select: ['id'],
      where: { userId, quiz: { techId } },
      relations: { quiz: true },
    });

    const solvedIdSet = new Set(histories.map((h) => h.quizId));
    const all = await this.repo.findMany({
      select: ['id'],
      where: { techId },
    });
    const unsolvedIdSet = new Set(all.map((q) => q.id)).difference(solvedIdSet);

    return {
      cntHistory: {
        today: todayCorrect.length,
        month: monthCorrect.length,
        total: totalCorrect.length,
      },
      correctRate: {
        month: ((monthCorrect.length / monthHistories.length) * 100).toFixed(0),
        total: ((totalCorrect.length / histories.length) * 100).toFixed(0),
      },
      cntSolvedQuiz: solvedIdSet.size,
      cntQuiz,
      cntBookmark: bookmarks.length,
      cntDifficult: difficults.length,
      cntUnsolved: unsolvedIdSet.size,
    };
  }

  async getList(options: {
    techId?: number;
    userId: number;
    onlyBookmarked?: boolean;
    onlyDifficult?: boolean;
    onlyUnsolved?: boolean;
  }) {
    const condition: FindOptionsWhere<QuizEntity> = {};
    if (options.techId) condition.techId = options.techId;

    if (
      options.onlyBookmarked ||
      options.onlyDifficult ||
      options.onlyUnsolved
    ) {
      const mandatoryIdSetMap: Record<string, Set<number>> = {};
      if (options.onlyBookmarked) {
        mandatoryIdSetMap['bookmark'] = new Set<number>();
        const bookmarks = await this.bookmarkRepo.findMany({
          select: ['quizId'],
          where: {
            userId: options.userId,
          },
        });
        bookmarks.forEach((bookmark) =>
          mandatoryIdSetMap['bookmark'].add(bookmark.quizId),
        );
      }

      if (options.onlyDifficult) {
        mandatoryIdSetMap['difficult'] = new Set<number>();
        const difficults = await this.difficultRepo.findMany({
          select: ['quizId'],
          where: {
            userId: options.userId,
          },
        });
        difficults.forEach((difficult) =>
          mandatoryIdSetMap['difficult'].add(difficult.quizId),
        );
      }

      if (options.onlyUnsolved) {
        const all = await this.repo.findMany({
          select: ['id'],
          where: condition,
        });
        const allIds = all.map((item) => item.id);
        const allIdSet = new Set<number>(allIds);

        const solved = await this.submitHistoryRepo.findMany({
          select: ['quizId'],
          where: {
            userId: options.userId,
            quizId: In(allIds),
          },
        });
        const solvedIdSet = new Set<number>(solved.map((s) => s.quizId));

        mandatoryIdSetMap['unsolved'] = allIdSet.difference(solvedIdSet);
      }

      const sets = Object.values(mandatoryIdSetMap);
      const mandatoryIds = sets.reduce((acc, set) => acc.intersection(set));
      condition.id = In([...mandatoryIds]);
    }

    const list = await this.repo.findMany({
      where: condition,
      order: {
        questionNumber: 'ASC',
      },
    });

    const quizIds = list.map((q) => q.id);

    const difficult = await this.difficultRepo.findMany({
      select: ['quizId'],
      where: {
        userId: options.userId,
        quizId: In(quizIds),
      },
    });

    const bookmark = await this.bookmarkRepo.findMany({
      select: ['quizId'],
      where: {
        userId: options.userId,
        quizId: In(quizIds),
      },
    });

    const solved = await this.submitHistoryRepo.findMany({
      select: ['quizId'],
      where: {
        isCorrect: true,
        userId: options.userId,
        quizId: In(quizIds),
      },
    });

    const solvedCountMap = solved.reduce(
      (acc, cur) => {
        if (!acc[cur.quizId]) acc[cur.quizId] = 0;
        acc[cur.quizId]++;
        return acc;
      },
      {} as Record<number, number>,
    );

    return list.map((item) => {
      return {
        ...item,
        isDifficult: difficult.some((d) => d.quizId === item.id),
        isBookmarked: bookmark.some((b) => b.quizId === item.id),
        cntSolved: solvedCountMap[item.id] || 0,
      };
    });
  }

  async getRandom(
    techId: number,
    options: {
      userId: number;
      sessionId: string;
    },
  ) {
    /**
     * 우선순위
     * 1. 안풀어본 퀴즈 중 무작위
     * 2. 없으면 그냥 무작위
     */
    let targetQuizId: number = -1;

    const all = await this.repo.findMany({
      select: ['id'],
      where: { techId },
    });
    const allIds = all.map((q) => q.id);

    const solved = await this.submitHistoryRepo.findMany({
      select: ['quizId'],
      where: { userId: options.userId },
    });
    const solvedIds = solved.map((s) => s.quizId);
    const unsolvedIds = [...new Set(allIds).difference(new Set(solvedIds))];

    if (unsolvedIds.length)
      targetQuizId =
        unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];
    else targetQuizId = allIds[Math.floor(Math.random() * allIds.length)];

    const quiz = await this.repo.findOne(
      { id: targetQuizId },
      {
        attachments: true,
      },
    );

    const bookmarked = await this.bookmarkRepo.findOne({
      quizId: targetQuizId,
      userId: options.userId,
    });

    const difficult = await this.difficultRepo.findOne({
      quizId: targetQuizId,
      userId: options.userId,
    });

    const needShowAd = await this.adService.needShowAd(options.userId);

    this.enterHistoryRepo.create({
      quizId: targetQuizId,
      userId: options.userId,
      enterMethod: EQuizEnterMethod.SHUFFLE,
    });

    return {
      quiz,
      isBookmarked: !!bookmarked,
      isDifficult: !!difficult,
      cntChoice: quiz?.answer.split(',').length,
      needShowAd,
    };
  }

  async getDetail(
    id: number,
    options: { userId: number; sessionId: string; method: EQuizEnterMethod },
  ) {
    const quiz = await this.repo.findOne(
      { id },
      {
        attachments: true,
      },
    );

    if (!quiz) return null;

    const bookmarked = await this.bookmarkRepo.findOne({
      quizId: id,
      userId: options.userId,
    });

    const difficult = await this.difficultRepo.findOne({
      quizId: id,
      userId: options.userId,
    });

    const needShowAd = await this.adService.needShowAd(options.userId);

    this.enterHistoryRepo.create({
      quizId: id,
      userId: options.userId,
      enterMethod: options.method,
    });

    return {
      quiz,
      isBookmarked: !!bookmarked,
      isDifficult: !!difficult,
      cntChoice: quiz.answer.split(',').length,
      needShowAd,
    };
  }

  async getExplanation(
    id: number,
    options: { userId: number; sessionId: string },
  ) {
    const quiz = await this.repo.findOne({ id });
    if (!quiz) return null;

    const qc = await this.commandRepo.findMany({
      where: { quizId: id },
      relations: {
        command: true,
      },
    });
    const relatedCommands = qc.map((q) => ({
      id: q.commandId,
      name: q.command.name,
    }));

    return {
      explanation: quiz.explanation,
      tip: quiz.tip,
      relatedCommands,
    };
  }

  async submit(
    id: number,
    options: {
      userId: number;
      sessionId: string;
      myAnswer: string | null;
      takenSeconds: number;
    },
  ) {
    const quiz = await this.repo.findOne({ id });
    if (!quiz) return null;

    const myAnswer = options.myAnswer
      ? options.myAnswer.split(',').sort().join(',')
      : null;
    const isCorrect = myAnswer === quiz.answer;

    // 잘모르겠어요 표시 / 표시해제
    if (!options.myAnswer)
      this.difficultRepo.create({
        quizId: id,
        userId: options.userId,
      });
    if (isCorrect) {
      const difficult = await this.difficultRepo.findOne({
        quizId: id,
        userId: options.userId,
      });
      if (difficult)
        await this.difficultRepo.update(
          { id: difficult.id },
          { resolvedAt: new Date() },
        );
    }

    const cntAlreadyTried = await this.submitHistoryRepo.count({
      quizId: id,
      userId: options.userId,
    });

    await this.submitHistoryRepo.create({
      quizId: id,
      userId: options.userId,
      isCorrect,
      choicedAnswer: myAnswer,
      takenSeconds: options.takenSeconds,
      cntTry: cntAlreadyTried + 1,
    });

    return {
      isCorrect,
    };
  }

  async bookmark(id: number, userId: number, sessionId: string) {
    const bookmark = await this.bookmarkRepo.findOne({ quizId: id, userId });
    if (bookmark) {
      await this.bookmarkRepo.deleteWithWhere({ quizId: id, userId });
      return false;
    }
    await this.bookmarkRepo.create({ quizId: id, userId });
    return true;
  }

  async getHistoryList(
    query: HistoryListQueryDto,
    options: { userId: number; sessionId: string },
  ) {
    const techId = Number(query.techId);
    const from = Number(query.from);
    const limit = Number(query.limit);
    const term = query.term;
    const { userId, sessionId } = options;

    const condition: FindOptionsWhere<QuizSubmitHistoryEntity> = {
      userId,
      quiz: {
        techId,
      },
    };

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    switch (term) {
      case 'today':
        condition.createdAt = MoreThanOrEqual(startDate);
        break;
      case '30days':
        const thirtyDaysAgo = new Date(startDate.getTime() - ONE_DAY * 30);
        condition.createdAt = MoreThanOrEqual(thirtyDaysAgo);
        break;
      case 'thisyear':
        startDate.setMonth(0, 1);
        condition.createdAt = MoreThanOrEqual(startDate);
        break;
    }

    const option: FindManyOptions<QuizSubmitHistoryEntity> = {
      skip: from || 0,
      take: limit || 20,
      where: condition,
      relations: { quiz: true },
    };

    const histories = await this.submitHistoryRepo.findMany(option);
    return histories;
  }

  async getHistoryDetail(
    historyId: number,
    options: { userId: number; sessionId: string },
  ) {
    const history = await this.submitHistoryRepo.findOne(
      {
        id: historyId,
        userId: options.userId,
      },
      { quiz: { attachments: true } },
    );
    if (!history) return null;

    const { quiz, ...rest } = history;

    return {
      history: rest,
      quiz,
    };
  }
}
