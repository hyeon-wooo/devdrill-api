import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tech', comment: '기술스택' })
export class TechEntity extends DefaultEntity {
  @Column({ comment: '이름' })
  name: string;
  @Column('int', { comment: '앱 출력 순서 (낮을수록 우선)', default: 10 })
  displaySequence: number;

  @Column('boolean', { comment: '앱에서 사용가능한지 여부', default: false })
  isAvailable: boolean;

  @Column('int', { comment: '명령어 개수', default: 0 })
  cntCommand: number;

  @Column('int', { comment: '퀴즈 개수', default: 0 })
  cntQuiz: number;
}
