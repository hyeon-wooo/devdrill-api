export class RandomQuestionQueryDto {
  categoryId: number;
  ignoreAlreadySolved: 'y' | 'n';
}

export class SubmitQuestionBodyDto {
  myAnswer: string;
}
