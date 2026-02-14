import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandLikeEntity } from '../entity/command-like.entity';

@Injectable()
export class CommandLikeRepository extends CRUDService<CommandLikeEntity> {
  constructor(
    @InjectRepository(CommandLikeEntity) repo: Repository<CommandLikeEntity>,
  ) {
    super(repo);
  }
}
