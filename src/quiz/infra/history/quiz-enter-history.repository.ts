import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizEnterHistoryEntity } from './quiz-enter-history.entity';

@Injectable()
export class QuizEnterHistoryRepository extends CRUDService<QuizEnterHistoryEntity> {
  constructor(
    @InjectRepository(QuizEnterHistoryEntity)
    repo: Repository<QuizEnterHistoryEntity>,
  ) {
    super(repo);
  }
}
