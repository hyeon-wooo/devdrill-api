import { DefaultDto, ListQueryDto } from 'src/common/default.dto';
import {
  EQuestionCodeLanguage,
  EQuestionMetadataPosition,
  EQuestionMetadataType,
} from '../domain/question.enum';
import { QuestionMetadataEntity } from '../infra/question-metadata.entity';
import { CategoryEntity } from 'src/category/category.entity';
import { QuestionEntity } from '../infra/question.entity';
import { IntersectionType } from '@nestjs/mapped-types';

export class RandomQuestionQueryDto {
  categoryId: number;
  ignoreAlreadySolved: 'y' | 'n';
}

export class SubmitQuestionBodyDto {
  myAnswer: string;
}

export class QuestionMetadataFieldDto {
  position: EQuestionMetadataPosition;
  type: EQuestionMetadataType;
  imageId: number | null;
  codeSource: string | null;
  codeLanguage: EQuestionCodeLanguage | null;
  questionId?: number;
  id?: number;
}

export class QuestionFieldDto {
  content: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  choiceE: string | null;
  choiceF: string | null;
  answer: string;
  topic: string;
  explanation: string;
  explanation2: string | null;
  explanation3: string | null;
  metadata: QuestionMetadataFieldDto[];
  isPremium: boolean;
  categoryId: number;
  questionNumber: number;
}
export class QuestionDto extends IntersectionType(
  DefaultDto,
  QuestionFieldDto,
) {}

export class CreateQuestionBodyDto extends QuestionFieldDto {}
export class UpdateQuestionBodyDto extends CreateQuestionBodyDto {}

export class QuestionListQueryDto extends ListQueryDto {
  categoryId: string;
}

export class QuestionListItemDto {
  constructor(question: QuestionEntity) {
    this.id = question.id;
    this.createdAt = question.createdAt;
    this.isPremium = question.isPremium;
    this.categoryId = question.categoryId;
    this.category = question.category;
    this.questionNumber = question.questionNumber;
    this.hasMetadata = question.hasMetadata;
    this.topic = question.topic;
  }
  id: number;
  createdAt: Date;
  isPremium: boolean;
  categoryId: number;
  category: CategoryEntity;
  questionNumber: number;
  hasMetadata: boolean;
  topic: string;
}
