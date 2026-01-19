import { DefaultEntity } from 'src/common/default.entity';
import { QuestionEntity } from 'src/question/infra/question.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'practice_set', comment: '모의고사 문제 세트' })
export class PracticeSetEntity extends DefaultEntity {
  @Column('int', { comment: '모의고사 ID (practice.id)' })
  practiceId: number;

  @Column('int', { comment: '문제 ID (question.id)' })
  questionId: number;

  @Column('int', { comment: '문제 순서 (낮을수록 우선)', default: 0 })
  sequence: number;

  @Column('boolean', { comment: '정답 여부', nullable: true })
  isCorrect: boolean | null;

  @Column('varchar', { comment: '선택한 보기', nullable: true })
  choicedAnswer: string | null;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;
}
