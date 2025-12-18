import { Module } from '@nestjs/common';
import { AdController } from './interface/ad.controller';
import { AdService } from './app/ad.service';
import { AdLastHistoryEntity } from './infra/ad-last-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdHistoryEntity } from './infra/ad-history.entity';
import { AdLastHistoryService } from './app/ad-last-history.service';
import { AdHistoryService } from './app/ad-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdHistoryEntity, AdLastHistoryEntity])],
  controllers: [AdController],
  providers: [AdService, AdHistoryService, AdLastHistoryService],
  exports: [AdService],
})
export class AdModule {}
