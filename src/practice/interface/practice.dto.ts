import { ListQueryDto } from 'src/common/default.dto';
import { EPracticeSelectionCondition } from '../domain/practice.enum';

export class CreatePracticeBodyDto {
  examId: number;
  selectionCondition: EPracticeSelectionCondition;
  questionCount: number;
}

export class SubmitPracticeBodyDto {
  answers: string[];
  isCancelled: boolean;
}

export class GetMyPracticesQueryDto extends ListQueryDto {
  examId?: string;
  exceptCancelled?: 'y' | 'n';
}
