import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  ECodeLanguage,
  EQuizAttachmentPosition,
  EQuizAttachmentType,
} from '../../domain/quiz.enum';
import { QuizEntity } from '../quiz/quiz.entity';
import { FileEntity } from 'src/file/infra/file.entity';

@Entity({
  name: 'quiz_attachment',
  comment: '퀴즈 첨부데이터 (이미지, 코드 등)',
  orderBy: { createdAt: 'DESC' },
})
export class QuizAttachmentEntity extends DefaultEntity {
  @Column('enum', {
    comment: 'attachment 위치',
    enum: EQuizAttachmentPosition,
  })
  position: EQuizAttachmentPosition;

  @Column('enum', {
    comment: 'attachment 종류',
    enum: EQuizAttachmentType,
  })
  type: EQuizAttachmentType;

  @Column('int', { comment: '이미지 ID (file.id)', nullable: true })
  imageId: number | null;

  @Column('text', { comment: '코드', nullable: true })
  codeSource: string | null;

  @Column('enum', {
    comment: '코드 언어',
    nullable: true,
    enum: ECodeLanguage,
  })
  codeLanguage: ECodeLanguage | null;

  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.attachments)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'imageId' })
  image: FileEntity;
}
