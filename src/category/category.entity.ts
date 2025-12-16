import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'category', comment: '카테고리' })
export class CategoryEntity extends DefaultEntity {
  @Column('varchar', { comment: '카테고리 이름' })
  name: string;

  @Column('int', { comment: '카테고리 문제 수' })
  cntQuestion: number;
}
