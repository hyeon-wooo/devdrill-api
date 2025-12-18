import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'token_history', comment: '리프레시 토큰 발급 내역' })
export class TokenHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '사용자 ID' })
  userId: number;

  @Column('varchar', { comment: '리프레시 토큰' })
  refreshToken: string;

  @Column('datetime', { comment: '발급 일시' })
  issuedAt: Date;

  @Column('datetime', { comment: '만료 일시' })
  expiredAt: Date;

  @Column('varchar', { comment: '발급 IP' })
  issuedIp: string;

  @Column('varchar', { comment: '발급 디바이스 ID' })
  issuedDeviceId: string;
}
