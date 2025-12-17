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
}
