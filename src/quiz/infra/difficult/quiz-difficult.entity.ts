import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { QuizEntity } from '../quiz/quiz.entity';
import { UserEntity } from 'src/user/infra/user.entity';

@Entity({ name: 'quiz_difficult', comment: '잘모르겠어요 내역' })
export class QuizDifficultEntity extends DefaultEntity {
  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;

  @Column('int', { comment: '사용자 ID (user.id)' })
  userId: number;

  @Column('timestamp', { comment: '해결 일시 (이제 알겠어요)', nullable: true })
  resolvedAt: Date | null;

  @ManyToOne(() => QuizEntity)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
