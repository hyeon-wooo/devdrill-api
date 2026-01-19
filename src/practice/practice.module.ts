import { Module } from '@nestjs/common';
import { PracticeController } from './interface/practice.controller';
import { PracticeService } from './app/practice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from 'src/question/question.module';
import { PracticeEntity } from './infra/practice/practice.entity';
import { PracticeSetEntity } from './infra/practice-set/practice-set.entity';
import { PracticeRepository } from './infra/practice/practice.repository';
import { PracticeSetRepository } from './infra/practice-set/practice-set.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeEntity, PracticeSetEntity]),
    QuestionModule,
  ],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeRepository, PracticeSetRepository],
  exports: [PracticeService],
})
export class PracticeModule {}
