import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { TechLogEntity } from './tech-log.entity';

@Injectable()
export class TechLogRepository extends CRUDService<TechLogEntity> {
  constructor(
    @InjectRepository(TechLogEntity) repo: Repository<TechLogEntity>,
  ) {
    super(repo);
  }
}
