import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), QuestionModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
