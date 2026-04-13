import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { TechEntity } from './tech.entity';

@Injectable()
export class TechRepository extends CRUDService<TechEntity> {
  constructor(@InjectRepository(TechEntity) repo: Repository<TechEntity>) {
    super(repo);
  }
}
