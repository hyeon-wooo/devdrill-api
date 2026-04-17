import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuizAttachmentEntity } from './quiz-attachment.entity';

@Injectable()
export class QuizAttachmentRepository extends CRUDService<QuizAttachmentEntity> {
  constructor(
    @InjectRepository(QuizAttachmentEntity)
    repo: Repository<QuizAttachmentEntity>,
  ) {
    super(repo);
  }
}
