import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { ExamEntity } from './exam.entity';

@Injectable()
export class ExamService extends CRUDService<ExamEntity> {
  constructor(@InjectRepository(ExamEntity) repo: Repository<ExamEntity>) {
    super(repo);
  }
}
