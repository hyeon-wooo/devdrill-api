import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { JoinColumn } from 'typeorm';
import { QuestionMetadataEntity } from './question-metadata.entity';
import { ExamEntity } from 'src/exam/infra/exam.entity';
import { ExamSubjectEntity } from 'src/exam/infra/subject.entity';

@Entity({ name: 'question', comment: '문제' })
export class QuestionEntity extends DefaultEntity {
  @Column('int', { comment: '문제 번호' })
  questionNumber: number;

  @Column('text', { comment: '문제 내용' })
  content: string;

  @Column('text', { comment: '보기 A' })
  choiceA: string;

  @Column('text', { comment: '보기 B' })
  choiceB: string;

  @Column('text', { comment: '보기 C' })
  choiceC: string;

  @Column('text', { comment: '보기 D' })
  choiceD: string;

  @Column('text', { comment: '보기 E', nullable: true })
  choiceE: string | null;

  @Column('text', { comment: '보기 F', nullable: true })
  choiceF: string | null;

  @Column('varchar', { comment: '정답. 복수정답의 경우 콤마+공백문자로 구분' })
  answer: string;

  @Column('varchar', { comment: '주제', default: 'unknown' })
  topic: string;

  @Column('text', { comment: '해설' })
  explanation: string;
  @Column('text', { comment: '해설2', nullable: true })
  explanation2: string | null;
  @Column('text', { comment: '해설3', nullable: true })
  explanation3: string | null;

  @Column('boolean', { default: false, comment: '프리미엄 문제 여부' })
  isPremium: boolean;

  @Column('boolean', { default: false, comment: '메타데이터 존재 여부' })
  hasMetadata: boolean;

  @Column('int', { comment: '시험 ID (exam.id)', nullable: true })
  examId: number | null;

  @Column('int', { comment: '과목 ID (subject.id)', nullable: true })
  subjectId: number | null;

  @ManyToOne(() => ExamEntity)
  @JoinColumn({ name: 'examId' })
  exam: ExamEntity;

  @ManyToOne(() => ExamSubjectEntity)
  @JoinColumn({ name: 'subjectId' })
  subject: ExamSubjectEntity;

  @OneToMany(() => QuestionMetadataEntity, (metadata) => metadata.question)
  metadata: QuestionMetadataEntity[];
}
