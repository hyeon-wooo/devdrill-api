import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DefaultEntity {
  @PrimaryGeneratedColumn({
    comment: '테이블의 각 데이터를 구분짓는 고유값',
  })
  id: number;

  @CreateDateColumn({ comment: 'row 생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: 'row 수정일시' })
  updatedAt: Date;

  @DeleteDateColumn({ comment: 'row 삭제일시' })
  deletedAt?: Date;

  @Column('varchar', { nullable: true, comment: '관리자 참고용 메모' })
  memo: string | null;
}
