import { ETopic } from 'src/command/domain/command.enum';
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

  @Column('datetime', {
    nullable: true,
    comment: '마지막 접속 일시',
    default: null,
  })
  lastAccessAt: Date | null;

  @Column('boolean', { default: false, comment: '광고 건너뛰기 가능 여부' })
  canSkipAd: boolean;

  @Column('boolean', { default: false, comment: '모든 문제 읽기 가능 여부' })
  canReadAll: boolean;

  @Column('enum', {
    enum: ETopic,
    comment: '관심 주제',
    default: null,
    nullable: true,
  })
  interestTopic: ETopic | null;

  @Column('int', {
    comment: '관심 기술스택 ID (tech.id)',
    default: null,
    nullable: true,
  })
  interestTechId: number | null;
}
