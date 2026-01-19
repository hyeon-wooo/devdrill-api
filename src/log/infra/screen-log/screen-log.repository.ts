import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { ScreenLogEntity } from './screen-log.entity';

@Injectable()
export class ScreenLogRepository extends CRUDService<ScreenLogEntity> {
  constructor(@InjectRepository(ScreenLogEntity) repo: Repository<ScreenLogEntity>) {super(repo);}
}