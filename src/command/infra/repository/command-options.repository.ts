import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandOptionEntity } from '../entity/command-option.entity';

@Injectable()
export class CommandOptionRepository extends CRUDService<CommandOptionEntity> {
  constructor(
    @InjectRepository(CommandOptionEntity)
    repo: Repository<CommandOptionEntity>,
  ) {
    super(repo);
  }
}
