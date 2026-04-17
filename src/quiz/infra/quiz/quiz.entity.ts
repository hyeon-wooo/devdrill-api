import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuizAttachmentEntity } from '../attachment/quiz-attachment.entity';
import { QuizCommandEntity } from '../command/quiz-command.entity';

@Entity({ name: 'quiz' })
export class QuizEntity extends DefaultEntity {
  @Column('int', { comment: '문제 번호' })
  questionNumber: number;

  @Column({ comment: '문제 제목' })
  title: string;
  @Column('text', { comment: '문제 내용' })
  content: string;

  @Column({
    comment: '보기 A (attachment만 있는 경우 빈문자열. 다른 보기도 동일.)',
  })
  choiceA: string;
  @Column({ comment: '보기 B' })
  choiceB: string;
  @Column({ comment: '보기 C' })
  choiceC: string;
  @Column({ comment: '보기 D' })
  choiceD: string;
  @Column({ comment: '정답. 복수정답의 경우 콤마로 구분' })
  answer: string;

  @Column('text', { comment: '해설' })
  explanation: string;
  @Column('text', {
    comment:
      '공부 팁 (explanation은 정석적인 해설이고, 관련 명령 및 개념을 쉽게 이해할 수 있는 출제자만의 팁)',
    nullable: true,
  })
  tip: string | null;

  @Column('boolean', { default: false, comment: '프리미엄 문제 여부' })
  isPremium: boolean;

  @Column('boolean', { default: false, comment: 'attachment 존재 여부' })
  hasAttachment: boolean;

  @Column('int', { comment: '기술스택 ID (tech.id)' })
  techId: number;

  @OneToMany(() => QuizAttachmentEntity, (attach) => attach.quiz)
  attachments: QuizAttachmentEntity[];

  @OneToMany(() => QuizCommandEntity, (qc) => qc.quiz)
  quizCommands: QuizCommandEntity[];
}
