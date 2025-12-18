import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';
import { EAdEventType } from '../domain/ad.enum';

@Entity({ name: 'ad_history', comment: '광고 시청 내역' })
export class AdHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '사용자 ID' })
  userId: number;

  @Column('enum', { comment: '광고 이벤트 타입', enum: EAdEventType })
  eventType: EAdEventType;
}
