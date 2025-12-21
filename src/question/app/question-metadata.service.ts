import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QuestionMetadataEntity } from '../infra/question-metadata.entity';

@Injectable()
export class QuestionMetadataService extends CRUDService<QuestionMetadataEntity> {
  constructor(
    @InjectRepository(QuestionMetadataEntity)
    repo: Repository<QuestionMetadataEntity>,
  ) {
    super(repo);
  }
}
