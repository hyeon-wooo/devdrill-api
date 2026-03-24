import { Injectable } from '@nestjs/common';
import { CommandRepository } from '../infra/repository/command.repository';
import { CommandLikeRepository } from '../infra/repository/command-like.repository';
import { CommandBookmarkRepository } from '../infra/repository/command-bookmark.repository';
import { CommandMasteryRepository } from '../infra/repository/command-mastery.repository';
import { CommandSubRepository } from '../infra/repository/command-sub.repository';
import { CommandOptionRepository } from '../infra/repository/command-options.repository';
import { CommandExampleRepository } from '../infra/repository/command-example.repository';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { CommandEntity } from '../infra/entity/command.entity';
import { CommandCategoryRepository } from '../infra/repository/command-category.repository';
import {
  ECommandImportance,
  ECommandMastery,
  ETopic,
} from '../domain/command.enum';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CommandService {
  constructor(
    private readonly repo: CommandRepository,
    private readonly categoryRepo: CommandCategoryRepository,
    private readonly likeRepo: CommandLikeRepository,
    private readonly bookmarkRepo: CommandBookmarkRepository,
    private readonly masteryRepo: CommandMasteryRepository,
    private readonly subRepo: CommandSubRepository,
    private readonly optionRepo: CommandOptionRepository,
    private readonly exampleRepo: CommandExampleRepository,
    private readonly redisService: RedisService,
  ) {}

  async getList(userId: number, isPremium: boolean) {
    const condition: FindOptionsWhere<CommandEntity> = {};
    if (isPremium) condition.isPremium = true;

    const categories = await this.categoryRepo.findMany({
      relations: {
        commands: true,
      },
      order: {
        displaySequence: 'ASC',
      },
    });

    const categoryCommands = categories.map((category) => {
      const { id, name, commands } = category;
      return {
        category: {
          id,
          name,
        },
        commands: (isPremium
          ? commands
          : commands.filter((command) => command.isPremium === false)
        ).sort((a, b) => a.displaySequence - b.displaySequence),
      };
    });

    const bookmarked = await this.bookmarkRepo.findMany({
      select: ['commandId'],
      where: {
        userId,
      },
    });

    const liked = await this.likeRepo.findMany({
      select: ['commandId'],
      where: {
        userId,
      },
    });

    const mastery = await this.masteryRepo.findMany({
      where: {
        userId,
      },
    });

    return {
      list: categoryCommands,
      bookmarkedIds: bookmarked.map((bookmark) => bookmark.commandId),
      likedIds: liked.map((like) => like.commandId),
      mastery: mastery.map((m) => ({
        commandId: m.commandId,
        mastery: m.mastery,
      })),
    };
  }

  async getDetail(commandId: number, userId: number) {
    let command: CommandEntity | null = null;

    // Look Aside
    const cached = await this.redisService.getCommandCache(commandId);
    if (!cached.needUpdate) command = cached.command;
    else {
      const gapStart = Date.now();
      command = await this.repo.findOne(
        { id: commandId },
        { subCommands: { options: true }, examples: true },
      );
      const gapEnd = Date.now();
      if (!command) return null;
      this.redisService.setCommandCache(command, gapEnd - gapStart);
    }

    const bookmarked = await this.bookmarkRepo.findOne({ commandId, userId });
    const liked = await this.likeRepo.findOne({ commandId, userId });
    const mastery = await this.masteryRepo.findOne({ commandId, userId });

    return {
      command: {
        ...command,
        subCommands: command?.subCommands.sort(
          (a, b) => a.displaySequence - b.displaySequence,
        ),
        examples: command?.examples.sort(
          (a, b) => a.displaySequence - b.displaySequence,
        ),
      },
      isBookmark: !!bookmarked,
      isLiked: !!liked,
      mastery: !!mastery ? mastery.mastery : ECommandMastery.NOT_AT_ALL,
    };
  }

  async like(commandId: number, userId: number) {
    const like = await this.likeRepo.findOne({ commandId, userId });
    if (like) {
      await this.likeRepo.deleteWithWhere({ commandId, userId });
      this.repo.update({ id: commandId }, { cntLike: () => 'cntLike - 1' });
      return false;
    }
    await this.likeRepo.create({ commandId, userId });
    this.repo.update({ id: commandId }, { cntLike: () => 'cntLike + 1' });
    return true;
  }

  async bookmark(commandId: number, userId: number) {
    const bookmark = await this.bookmarkRepo.findOne({ commandId, userId });
    if (bookmark) {
      await this.bookmarkRepo.deleteWithWhere({ commandId, userId });
      return false;
    }
    await this.bookmarkRepo.create({ commandId, userId });
    return true;
  }

  async updateMastery(
    commandId: number,
    userId: number,
    mastery: ECommandMastery,
  ) {
    const priv = await this.masteryRepo.findOne({ commandId, userId });
    if (priv) {
      await this.masteryRepo.update({ id: priv.id }, { mastery });
      return;
    }
    await this.masteryRepo.create({ commandId, userId, mastery });
  }

  async getHome(userId: number, topic: ETopic | null) {
    if (!topic) return { categoryProgress: [], importanceProgress: {} };

    const categories = await this.categoryRepo.findMany({
      where: { topic },
      order: { displaySequence: 'ASC' },
    });
    const categoryProgress = categories.map((c) => ({
      id: c.id,
      name: c.name,
      active: 0,
      total: 0,
    }));
    const importanceProgress = {
      [ECommandImportance.HIGH]: { active: 0, total: 0 },
      [ECommandImportance.NORMAL]: { active: 0, total: 0 },
      [ECommandImportance.LOW]: { active: 0, total: 0 },
    };

    const allCommands = await this.repo.findMany({ where: { topic } });
    allCommands.forEach((c) => {
      const categoryIdx = categoryProgress.findIndex(
        (ca) => ca.id === c.categoryId,
      );
      categoryProgress[categoryIdx].total++;
      importanceProgress[c.importance].total++;
    });

    const masteries = await this.masteryRepo.findMany({
      select: ['commandId'],
      where: {
        userId,
        mastery: In([ECommandMastery.ASSOCIATE, ECommandMastery.MASTER]),
      },
    });
    const targetCommandIds = masteries.map((c) => c.commandId);

    const targetCommands = await this.repo.findMany({
      where: {
        id: In(targetCommandIds),
      },
      relations: { category: true },
    });

    targetCommands.forEach((c) => {
      const categoryIdx = categoryProgress.findIndex(
        (ca) => ca.id === c.categoryId,
      );
      categoryProgress[categoryIdx].active++;
      importanceProgress[c.importance].active++;
    });

    return {
      categoryProgress,
      importanceProgress,
    };
  }
}
