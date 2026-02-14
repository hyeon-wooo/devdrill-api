import { Injectable } from '@nestjs/common';
import { CommandRepository } from '../infra/repository/command.repository';
import { CommandLikeRepository } from '../infra/repository/command-like.repository';
import { CommandBookmarkRepository } from '../infra/repository/command-bookmark.repository';
import { CommandMasteryRepository } from '../infra/repository/cmmand-mastery.repository';

@Injectable()
export class CommandService {
  constructor(
    private readonly repo: CommandRepository,
    private readonly likeRepo: CommandLikeRepository,
    private readonly bookmarkRepo: CommandBookmarkRepository,
    private readonly masteryRepo: CommandMasteryRepository,
  ) {}
}
