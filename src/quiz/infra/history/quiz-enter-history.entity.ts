import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, Index } from 'typeorm';
import { EQuizAction, EQuizEnterMethod } from '../../domain/question.enum';

@Entity({ name: 'quiz_history_enter', comment: '문제풀이 진입 내역' })
export class QuizEnterHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;

  @Column('int', { comment: '사용자 ID (user.id)' })
  userId: number;

  @Column('enum', {
    comment: '진입 경로',
    enum: EQuizEnterMethod,
  })
  enterMethod: EQuizEnterMethod;
}
