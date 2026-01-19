import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { PracticeSetEntity } from './practice-set.entity';

@Injectable()
export class PracticeSetRepository extends CRUDService<PracticeSetEntity> {
  constructor(
    @InjectRepository(PracticeSetEntity) repo: Repository<PracticeSetEntity>,
  ) {
    super(repo);
  }
}
