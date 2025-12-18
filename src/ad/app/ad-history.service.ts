import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { AdHistoryEntity } from '../infra/ad-history.entity';

@Injectable()
export class AdHistoryService extends CRUDService<AdHistoryEntity> {
  constructor(
    @InjectRepository(AdHistoryEntity) repo: Repository<AdHistoryEntity>,
  ) {
    super(repo);
  }
}
