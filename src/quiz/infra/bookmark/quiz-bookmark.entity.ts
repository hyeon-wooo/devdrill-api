import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { QuizEntity } from '../quiz/quiz.entity';
import { UserEntity } from 'src/user/infra/user.entity';

@Entity({ name: 'quiz_bookmark', comment: '문제 즐겨찾기' })
export class QuizBookmarkEntity extends DefaultEntity {
  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;

  @Column('int', { comment: '사용자 ID (user.id)' })
  userId: number;

  @ManyToOne(() => QuizEntity)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
