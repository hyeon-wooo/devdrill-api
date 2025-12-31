import { DefaultDto, ListQueryDto } from 'src/common/default.dto';
import {
  EQuestionCodeLanguage,
  EQuestionMetadataPosition,
  EQuestionMetadataType,
  EQuestionQuizMode,
} from '../domain/question.enum';
import { QuestionMetadataEntity } from '../infra/question-metadata.entity';
import { CategoryEntity } from 'src/category/category.entity';
import { QuestionEntity } from '../infra/question.entity';
import { IntersectionType } from '@nestjs/mapped-types';
import { ExamEntity } from 'src/exam/exam.entity';

export class RandomQuestionQueryDto {
  examId: number;
  ignoreAlreadySolved: 'y' | 'n';
  quizMode: EQuestionQuizMode;
  prevQuestionId?: number;
}

export class SubmitQuestionBodyDto {
  myAnswer: string;
  quizMode: EQuestionQuizMode;
}

export class QuestionMetadataFieldDto {
  position: EQuestionMetadataPosition;
  type: EQuestionMetadataType;
  imageId: number | null;
  codeSource: string | null;
  codeLanguage: EQuestionCodeLanguage | null;
  questionId?: number;
  id?: number;
  image?: {
    id: number;
    urlOrigin: string;
    url512: string | null;
    url256: string | null;
    url128: string | null;
  };
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
  categoryId?: string;
  examId?: string;
}

export class QuestionListItemDto {
  constructor(question: QuestionEntity) {
    this.id = question.id;
    this.createdAt = question.createdAt;
    this.isPremium = question.isPremium;
    this.categoryId = question.categoryId;
    this.category = question.category;
    this.examId = question.examId;
    this.exam = question.exam;
    this.questionNumber = question.questionNumber;
    this.hasMetadata = question.hasMetadata;
    this.topic = question.topic;
  }
  id: number;
  createdAt: Date;
  isPremium: boolean;
  categoryId: number;
  category: CategoryEntity;
  examId: number | null;
  exam: ExamEntity;
  questionNumber: number;
  hasMetadata: boolean;
  topic: string;
}

export class QuestionQuizResponseDto {
  constructor(question: QuestionEntity) {
    this.id = question.id;
    this.questionNumber = question.questionNumber;
    this.content = question.content;
    this.choiceA = question.choiceA;
    this.choiceB = question.choiceB;
    this.choiceC = question.choiceC;
    this.choiceD = question.choiceD;
    this.choiceE = question.choiceE;
    this.choiceF = question.choiceF;
    this.answer = question.answer;
    this.isMultiple = question.answer.includes(',');
    this.maxChoices = question.answer.split(', ').length;
    this.metadata = question.metadata.map((meta) => {
      return {
        position: meta.position,
        type: meta.type,
        imageId: meta.imageId,
        codeSource: meta.codeSource,
        codeLanguage: meta.codeLanguage,
        image: meta.image
          ? {
              id: meta.image.id,
              urlOrigin: meta.image.urlOrigin,
              url512: meta.image.url512,
              url256: meta.image.url256,
              url128: meta.image.url128,
            }
          : undefined,
      };
    });
  }

  id: number;
  questionNumber: number;
  content: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  choiceE?: string | null;
  choiceF?: string | null;
  answer: string;
  isMultiple?: boolean;
  maxChoices?: number | null;
  metadata?: QuestionMetadataFieldDto[];
}

export class QuestionExploreQueryDto extends ListQueryDto {
  examId: number;
}
