import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandBookmarkEntity } from '../entity/command-bookmark.entity';

@Injectable()
export class CommandBookmarkRepository extends CRUDService<CommandBookmarkEntity> {
  constructor(
    @InjectRepository(CommandBookmarkEntity)
    repo: Repository<CommandBookmarkEntity>,
  ) {
    super(repo);
  }
}
