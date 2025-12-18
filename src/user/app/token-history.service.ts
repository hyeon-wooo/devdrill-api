import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { TokenHistoryEntity } from '../infra/token-history.entity';

@Injectable()
export class TokenHistoryService extends CRUDService<TokenHistoryEntity> {
  constructor(
    @InjectRepository(TokenHistoryEntity) repo: Repository<TokenHistoryEntity>,
  ) {
    super(repo);
  }
}
