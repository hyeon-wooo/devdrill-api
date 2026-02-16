import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { CommandCategoryEntity } from '../entity/command-category.entity';

@Injectable()
export class CommandCategoryRepository extends CRUDService<CommandCategoryEntity> {
  constructor(
    @InjectRepository(CommandCategoryEntity)
    repo: Repository<CommandCategoryEntity>,
  ) {
    super(repo);
  }
}
