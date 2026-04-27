import { ListQueryDto } from 'src/common/default.dto';

export class QuizListQueryDto {
  techId?: string;
  onlyBookmarked?: 'y' | 'n';
}

export class SubmitQuizBodyDto {
  myAnswer: string | null;
  takenSeconds: number;
}

export class HistoryListQueryDto extends ListQueryDto {
  techId: string;
  term: 'today' | '30days' | 'thisyear' | 'all';
}
