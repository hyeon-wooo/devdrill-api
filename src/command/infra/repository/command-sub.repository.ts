import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandSubEntity } from '../entity/command-sub.entity';

@Injectable()
export class CommandSubRepository extends CRUDService<CommandSubEntity> {
  constructor(
    @InjectRepository(CommandSubEntity) repo: Repository<CommandSubEntity>,
  ) {
    super(repo);
  }
}
