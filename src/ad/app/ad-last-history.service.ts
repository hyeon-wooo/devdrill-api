import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { AdLastHistoryEntity } from '../infra/ad-last-history.entity';

@Injectable()
export class AdLastHistoryService extends CRUDService<AdLastHistoryEntity> {
  constructor(
    @InjectRepository(AdLastHistoryEntity)
    repo: Repository<AdLastHistoryEntity>,
  ) {
    super(repo);
  }
}
