import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandEntity } from '../entity/command.entity';

@Injectable()
export class CommandRepository extends CRUDService<CommandEntity> {
  constructor(
    @InjectRepository(CommandEntity) repo: Repository<CommandEntity>,
  ) {
    super(repo);
  }
}
