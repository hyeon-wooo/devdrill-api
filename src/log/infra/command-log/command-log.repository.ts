import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandLogEntity } from './command-log.entity';

@Injectable()
export class CommandLogRepository extends CRUDService<CommandLogEntity> {
  constructor(
    @InjectRepository(CommandLogEntity) repo: Repository<CommandLogEntity>,
  ) {
    super(repo);
  }
}
