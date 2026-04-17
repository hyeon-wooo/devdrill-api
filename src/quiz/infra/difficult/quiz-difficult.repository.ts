import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizDifficultEntity } from './quiz-difficult.entity';

@Injectable()
export class QuizDifficultRepository extends CRUDService<QuizDifficultEntity> {
  constructor(
    @InjectRepository(QuizDifficultEntity)
    repo: Repository<QuizDifficultEntity>,
  ) {
    super(repo);
  }
}
