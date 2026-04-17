import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizEntity } from './quiz.entity';

@Injectable()
export class QuizRepository extends CRUDService<QuizEntity> {
  constructor(@InjectRepository(QuizEntity) repo: Repository<QuizEntity>) {
    super(repo);
  }
}
