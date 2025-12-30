import { Module } from '@nestjs/common';
import { PracticeController } from './interface/practice.controller';
import { PracticeService } from './application/practice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from 'src/question/question.module';
import { PracticeEntity } from './infrastructure/practice/practice.entity';
import { PracticeSetEntity } from './infrastructure/practice-set/practice-set.entity';
import { PracticeRepository } from './infrastructure/practice/practice.repository';
import { PracticeSetRepository } from './infrastructure/practice-set/practice-set.repository';

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
