import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { FcmHistoryEntity } from '../infra/fcm-history.entity';

@Injectable()
export class FcmHistoryService extends CRUDService<FcmHistoryEntity> {
  constructor(
    @InjectRepository(FcmHistoryEntity) repo: Repository<FcmHistoryEntity>,
  ) {
    super(repo);
  }
}
