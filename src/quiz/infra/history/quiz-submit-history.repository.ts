import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizSubmitHistoryEntity } from './quiz-submit-history.entity';

@Injectable()
export class QuizSubmitHistoryRepository extends CRUDService<QuizSubmitHistoryEntity> {
  constructor(
    @InjectRepository(QuizSubmitHistoryEntity)
    repo: Repository<QuizSubmitHistoryEntity>,
  ) {
    super(repo);
  }
}
