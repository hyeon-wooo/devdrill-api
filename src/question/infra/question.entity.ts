import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { JoinColumn } from 'typeorm';

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

  @Column('text', { comment: '해설' })
  explanation: string;

  @Column('boolean', { default: false, comment: '프리미엄 문제 여부' })
  isPremium: boolean;

  @Column('int', { comment: '카테고리 ID (category.id)' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;
}
