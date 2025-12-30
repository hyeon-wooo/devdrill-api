import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { PracticeEntity } from './practice.entity';

@Injectable()
export class PracticeRepository extends CRUDService<PracticeEntity> {
  constructor(
    @InjectRepository(PracticeEntity) repo: Repository<PracticeEntity>,
  ) {
    super(repo);
  }
}
