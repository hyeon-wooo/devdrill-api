import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { NoticeEntity } from '../infra/notice.entity';

@Injectable()
export class NoticeService extends CRUDService<NoticeEntity> {
  constructor(@InjectRepository(NoticeEntity) repo: Repository<NoticeEntity>) {super(repo);}
}