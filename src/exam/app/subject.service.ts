import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { ExamSubjectEntity } from '../infra/subject.entity';

@Injectable()
export class ExamSubjectService extends CRUDService<ExamSubjectEntity> {
  constructor(
    @InjectRepository(ExamSubjectEntity) repo: Repository<ExamSubjectEntity>,
  ) {
    super(repo);
  }
}
