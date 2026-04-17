import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizBookmarkEntity } from './quiz-bookmark.entity';

@Injectable()
export class QuizBookmarkRepository extends CRUDService<QuizBookmarkEntity> {
  constructor(
    @InjectRepository(QuizBookmarkEntity) repo: Repository<QuizBookmarkEntity>,
  ) {
    super(repo);
  }
}
