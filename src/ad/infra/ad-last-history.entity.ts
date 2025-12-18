import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'ad_last_history',
  comment: '마지막 광고 시청 내역',
})
export class AdLastHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '사용자 ID' })
  userId: number;

  @Column('datetime', { comment: '마지막 광고 시청 일시 (paid datetime)' })
  lastViewedAt: Date;
}
