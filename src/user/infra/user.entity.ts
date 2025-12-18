import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user', comment: '사용자' })
export class UserEntity extends DefaultEntity {
  @Column('varchar', { comment: '이름' })
  name: string;

  @Column('varchar', { comment: '이메일' })
  email: string;

  @Column('varchar', { comment: '비밀번호' })
  password: string;

  @Column('int', { comment: '등급', default: 10 })
  level: number;

  @Column('varchar', { nullable: true, comment: 'FCM 토큰' })
  fcm: string | null;

  @Column('datetime', { nullable: true, comment: '마지막 로그인 일시' })
  lastLoginAt: Date | null;

  @Column('boolean', { default: false, comment: '광고 건너뛰기 가능 여부' })
  canSkipAd: boolean;

  @Column('boolean', { default: false, comment: '모든 문제 읽기 가능 여부' })
  canReadAll: boolean;
}
