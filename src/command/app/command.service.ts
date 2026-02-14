import { Injectable } from '@nestjs/common';
import { CommandRepository } from '../infra/repository/command.repository';
import { CommandLikeRepository } from '../infra/repository/command-like.repository';
import { CommandBookmarkRepository } from '../infra/repository/command-bookmark.repository';
import { CommandMasteryRepository } from '../infra/repository/command-mastery.repository';
import { CommandSubRepository } from '../infra/repository/command-sub.repository';
import { CommandOptionRepository } from '../infra/repository/command-options.repository';
import { CommandExampleRepository } from '../infra/repository/command-example.repository';

@Injectable()
export class CommandService {
  constructor(
    private readonly repo: CommandRepository,
    private readonly likeRepo: CommandLikeRepository,
    private readonly bookmarkRepo: CommandBookmarkRepository,
    private readonly masteryRepo: CommandMasteryRepository,
    private readonly subRepo: CommandSubRepository,
    private readonly optionRepo: CommandOptionRepository,
    private readonly exampleRepo: CommandExampleRepository,
  ) {}
}
