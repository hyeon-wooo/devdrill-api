import { Module } from '@nestjs/common';
import { ExamController } from './interface/exam.controller';
import { ExamService } from './app/exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from './infra/exam.entity';
import { QuestionModule } from 'src/question/question.module';
import { ExamSubjectService } from './app/subject.service';
import { ExamSubjectEntity } from './infra/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamEntity, ExamSubjectEntity]),
    QuestionModule,
  ],
  controllers: [ExamController, ExamController],
  providers: [ExamService, ExamSubjectService],
  exports: [ExamService],
})
export class ExamModule {}
