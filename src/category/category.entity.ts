import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'category', comment: '카테고리' })
export class CategoryEntity extends DefaultEntity {
  @Column('varchar', { comment: '카테고리 이름' })
  name: string;

  @Column('int', { comment: '문제 수 (프리미엄 제외)' })
  cntQuestion: number;

  @Column('int', { comment: '문제 수 (프리미엄만)', default: 0 })
  cntQuestionPremium: number;

  @Column('boolean', { default: false, comment: '프리미엄 카테고리 여부' })
  isPremium: boolean;
}
