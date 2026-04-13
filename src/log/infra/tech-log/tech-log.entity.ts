import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'log_interest_tech' })
export class TechLogEntity {
  @PrimaryGeneratedColumn('increment', { comment: 'PK' })
  id: number;

  @Column('datetime', {
    comment: '화면 전환 일시',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  changedAt: Date;

  @Column('varchar', { comment: '세션 ID' })
  sessionId: string;

  @Column('int', { comment: '사용자 ID (user.id)', nullable: true })
  userId: number | null;

  @Column('int', { comment: '기술 ID (tech.id)', nullable: true })
  techId: number | null;
}
