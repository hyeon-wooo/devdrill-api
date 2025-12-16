import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuestionHistoryEntity } from '../infra/question-history.entity';

@Injectable()
export class QuestionHistoryService extends CRUDService<QuestionHistoryEntity> {
  constructor(
    @InjectRepository(QuestionHistoryEntity)
    repo: Repository<QuestionHistoryEntity>,
  ) {
    super(repo);
  }
}
