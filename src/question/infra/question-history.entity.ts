import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'question_history', comment: '문제풀이 내역' })
export class QuestionHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '문제 ID' })
  questionId: number;

  @Column('int', { comment: '사용자 ID' })
  userId: number;

  @Column('datetime', { comment: '정답 선택 일시', nullable: true })
  choicedAt: Date | null;

  @Column('varchar', { comment: '선택한 보기', nullable: true })
  choicedAnswer: string | null;

  @Column('boolean', { comment: '정답 여부', nullable: true })
  isCorrect: boolean | null;
}
