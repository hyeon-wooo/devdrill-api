import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { QnaEntity } from '../infra/qna.entity';

@Injectable()
export class QnaService extends CRUDService<QnaEntity> {
  constructor(@InjectRepository(QnaEntity) repo: Repository<QnaEntity>) {super(repo);}
}