import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  EQuestionCodeLanguage,
  EQuestionMetadataPosition,
  EQuestionMetadataType,
} from '../domain/question.enum';
import { QuestionEntity } from './question.entity';
import { FileEntity } from 'src/file/infra/file.entity';

@Entity({
  name: 'question_metadata',
  comment: '문제 메타데이터 (이미지, 코드 등)',
  orderBy: { createdAt: 'DESC' },
})
export class QuestionMetadataEntity extends DefaultEntity {
  @Column('enum', {
    comment: '문제 메타데이터 위치',
    enum: EQuestionMetadataPosition,
  })
  position: EQuestionMetadataPosition;

  @Column('enum', {
    comment: '문제 메타데이터 타입',
    enum: EQuestionMetadataType,
  })
  type: EQuestionMetadataType;

  @Column('int', { comment: '이미지 ID', nullable: true })
  imageId: number | null;

  @Column('text', { comment: '코드', nullable: true })
  codeSource: string | null;

  @Column('enum', {
    comment: '코드 언어',
    nullable: true,
    enum: EQuestionCodeLanguage,
  })
  codeLanguage: EQuestionCodeLanguage | null;

  @Column('int', { comment: '문제 ID' })
  questionId: number;

  @ManyToOne(() => QuestionEntity, (question) => question.metadata)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'imageId' })
  image: FileEntity;
}
