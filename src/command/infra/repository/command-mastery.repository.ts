import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandMasteryEntity } from '../entity/command-mastery.entity';

@Injectable()
export class CommandMasteryRepository extends CRUDService<CommandMasteryEntity> {
  constructor(
    @InjectRepository(CommandMasteryEntity)
    repo: Repository<CommandMasteryEntity>,
  ) {
    super(repo);
  }
}
