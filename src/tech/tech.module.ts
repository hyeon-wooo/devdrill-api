import { Module } from '@nestjs/common';
import { TechController } from './interface/tech.controller';
import { TechService } from './app/tech.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechEntity } from './infra/tech.entity';
import { TechRepository } from './infra/tech.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TechEntity])],
  controllers: [TechController],
  providers: [TechService, TechRepository],
  exports: [TechService],
})
export class TechModule {}
