import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  EPracticeSelectionCondition,
  EPracticeStatus,
} from '../../domain/practice.enum';
import { ExamEntity } from 'src/exam/exam.entity';

@Entity({
  name: 'practice',
  comment: '모의고사',
})
export class PracticeEntity extends DefaultEntity {
  @Column('enum', {
    comment: '상태',
    enum: EPracticeStatus,
    default: EPracticeStatus.IN_PROGRESS,
  })
  status: EPracticeStatus;

  @Column('int', { comment: '사용자 ID (user.id)' })
  userId: number;

  @Column('int', { comment: '시험 ID (exam.id)' })
  examId: number;

  @Column('enum', {
    comment: '문제 선별 조건',
    enum: EPracticeSelectionCondition,
  })
  selectionCondition: EPracticeSelectionCondition;

  @Column('int', { comment: '문제 수', default: 0 })
  questionCount: number;

  @Column('int', { comment: '정답 수', default: 0 })
  correctCount: number;

  @Column('datetime', { nullable: true, comment: '종료 일시' })
  endAt: Date | null;

  @ManyToOne(() => ExamEntity)
  @JoinColumn({ name: 'examId' })
  exam: ExamEntity;
}
