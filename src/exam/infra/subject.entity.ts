import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExamEntity } from './exam.entity';

@Entity({ name: 'exam_subject', comment: '시험 과목' })
export class ExamSubjectEntity extends DefaultEntity {
  @Column('varchar', { comment: '과목명' })
  name: string;

  @Column('varchar', { comment: '과목 설명' })
  description: string;

  @Column('int', { comment: '과목 순서', default: 0 })
  sequence: number;

  @Column('int', { comment: '시험 ID (exam.id)' })
  examId: number;

  @ManyToOne(() => ExamEntity)
  @JoinColumn({ name: 'examId' })
  exam: ExamEntity;
}
