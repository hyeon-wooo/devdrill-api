import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'admin',
  comment: '관리자',
})
export class AdminEntity extends DefaultEntity {
  @Column('varchar', { comment: '이름' })
  name: string;

  @Column('varchar', { comment: '이메일' })
  email: string;

  @Column('varchar', { comment: '비밀번호' })
  password: string;

  @Column('int', { comment: '등급', default: 10 })
  level: number;
}
