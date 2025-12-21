import {
  EQuestionCodeLanguage,
  EQuestionMetadataPosition,
  EQuestionMetadataType,
} from '../domain/question.enum';
import { QuestionMetadataEntity } from '../infra/question-metadata.entity';

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
export class UpdateQuestionBodyDto {
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

export class CreateQuestionBodyDto {
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
