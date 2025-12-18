import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'product', comment: '인앱결제 상품' })
export class ProductEntity extends DefaultEntity {
  @Column('varchar', { comment: '상품 ID (스토어에 등록된 상품ID)' })
  productId: string;

  @Column('varchar', { comment: '상품 이름' })
  name: string;

  @Column('varchar', { comment: '상품 설명' })
  description: string;

  @Column('int', { comment: '상품 가격' })
  price: number;

  @Column('boolean', { comment: '상품 활성 여부', default: true })
  isActive: boolean;

  @Column('varchar', { comment: '스토어 플랫폼' })
  platform: 'ios' | 'android';

  @Column('int', { comment: '상품 정렬 순서 (높을수록 우선)', default: 0 })
  displayOrder: number;
}
