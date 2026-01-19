import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { LaunchLogEntity } from './launch-log.entity';

@Injectable()
export class LaunchLogRepository extends CRUDService<LaunchLogEntity> {
  constructor(@InjectRepository(LaunchLogEntity) repo: Repository<LaunchLogEntity>) {super(repo);}
}