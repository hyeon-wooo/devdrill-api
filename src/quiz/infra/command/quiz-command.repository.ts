import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizCommandEntity } from './quiz-command.entity';

@Injectable()
export class QuizCommandRepository extends CRUDService<QuizCommandEntity> {
  constructor(
    @InjectRepository(QuizCommandEntity) repo: Repository<QuizCommandEntity>,
  ) {
    super(repo);
  }
}
