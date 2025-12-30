import { DefaultEntity } from 'src/common/default.entity';
import { AfterLoad, Column, Entity } from 'typeorm';

@Entity({ name: 'exam', comment: '자격증시험 종류' })
export class ExamEntity extends DefaultEntity {
  /** 문제 수 (일반 + 프리미엄) */
  cntQuestion: number;
  /** 시험 이름 + 부제 (급수 등) */
  fullName: string;

  @Column('varchar', { comment: '시험 이름' })
  name: string;
  @Column('varchar', { comment: '시험 부제 (급수 등)', nullable: true })
  subName: string | null;

  @Column('int', { comment: '문제 수 (프리미엄 제외)', default: 0 })
  cntQuestionGeneral: number;

  @Column('int', { comment: '문제 수 (프리미엄만)', default: 0 })
  cntQuestionPremium: number;

  @Column('boolean', { default: false, comment: '프리미엄 여부' })
  isPremium: boolean;

  @AfterLoad()
  onLoad() {
    this.fullName = this.name + (this.subName ? ` ${this.subName}` : '');
    this.cntQuestion = this.cntQuestionGeneral + this.cntQuestionPremium;
  }
}
