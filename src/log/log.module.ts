import { Global, Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './app/log.service';
import { LaunchLogEntity } from './infra/launch-log/launch-log.entity';
import { ScreenLogEntity } from './infra/screen-log/screen-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchLogRepository } from './infra/launch-log/launch-log.repository';
import { ScreenLogRepository } from './infra/screen-log/screen-log.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LaunchLogEntity, ScreenLogEntity])],
  controllers: [LogController],
  providers: [LogService, LaunchLogRepository, ScreenLogRepository],
  exports: [LogService],
})
export class LogModule {}
