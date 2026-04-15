import { Injectable } from '@nestjs/common';
import { CommandRepository } from '../infra/repository/command.repository';
import {
  CommandCreateBodyDto,
  CommandListQueryDto,
  CommandSubCreateBodyDto,
  CommandSubUpdateBodyDto,
  CommandUpdateBodyDto,
} from '../interface/dto/command.dto';
import { DataSource, FindOptionsWhere, Like } from 'typeorm';
import { CommandEntity } from '../infra/entity/command.entity';
import { CommandSubRepository } from '../infra/repository/command-sub.repository';
import { CommandExampleRepository } from '../infra/repository/command-example.repository';
import { CommandOptionRepository } from '../infra/repository/command-options.repository';
import { CommandSubEntity } from '../infra/entity/command-sub.entity';
import { CommandOptionEntity } from '../infra/entity/command-option.entity';
import { CommandExampleEntity } from '../infra/entity/command-example.entity';

@Injectable()
export class CommandAdmService {
  constructor(
    private readonly repo: CommandRepository,
    private readonly subRepo: CommandSubRepository,
    private readonly exampleRepo: CommandExampleRepository,
    private readonly optionRepo: CommandOptionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getCommandList(query: CommandListQueryDto) {
    const { categoryId } = query;
    const from = Number(query.from || 0);
    const limit = Number(query.limit || 10);

    const condition: FindOptionsWhere<CommandEntity> = {};
    if (categoryId && categoryId !== 'none')
      condition.categoryId = Number(categoryId);

    if (query.searchKeyword) condition.name = Like(`%${query.searchKeyword}%`);

    const list = await this.repo.findMany({
      where: condition,
      skip: from,
      take: limit,
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });

    const result: { list: CommandEntity[]; totalCount?: number } = { list };
    if (query.needTotalCount === 'y') {
      const cnt = await this.repo.count(condition);
      result.totalCount = cnt;
    }

    return result;
  }

  async getCommandDetail(id: number) {
    const found = await this.repo.findOne(
      { id },
      { subCommands: true, examples: true },
    );
    found?.subCommands.sort((a, b) => a.displaySequence - b.displaySequence);
    found?.examples.sort((a, b) => a.displaySequence - b.displaySequence);
    return found;
  }

  async createCommand(body: CommandCreateBodyDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { examples, ...rest } = body;
      const created = await manager.save(CommandEntity, rest);

      if (!!examples)
        await manager.save(
          CommandExampleEntity,
          examples.map((example) => ({
            commandId: created.id,
            ...example,
          })),
        );

      return created;
    });
  }

  async updateCommand(id: number, body: CommandUpdateBodyDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { examples, ...rest } = body;

      await manager.update(CommandEntity, { id }, rest);

      // 기존 등록된 옵션 삭제 후 새로 등록
      await manager.softDelete(CommandExampleEntity, { commandId: id });
      if (!!examples)
        await manager.save(
          CommandExampleEntity,
          examples.map((example) => ({
            commandId: id,
            ...example,
          })),
        );

      return true;
    });
  }

  async createSubCommand(commandId: number, body: CommandSubCreateBodyDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { options, ...rest } = body;
      const created = await manager.save(CommandSubEntity, {
        commandId,
        ...rest,
      });

      if (!!options)
        await manager.save(
          CommandOptionEntity,
          options.map((option) => ({
            subCommandId: created.id,
            ...option,
          })),
        );

      return created;
    });
  }

  async updateSubCommand(subId: number, body: CommandSubUpdateBodyDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { options, ...rest } = body;

      await manager.update(CommandSubEntity, { id: subId }, rest);

      // 기존 등록된 옵션 삭제 후 새로 등록
      await manager.softDelete(CommandOptionEntity, { subCommandId: subId });
      if (!!options)
        await manager.save(
          CommandOptionEntity,
          options.map((option) => ({
            subCommandId: subId,
            ...option,
          })),
        );

      return true;
    });
  }

  async getSubDetail(id: number) {
    const found = await this.subRepo.findOne({ id }, { options: true });
    return found;
  }

  async deleteExamplesByCommandId(commandId: number) {
    await this.exampleRepo.deleteWithWhere({ commandId });
    return true;
  }
}
