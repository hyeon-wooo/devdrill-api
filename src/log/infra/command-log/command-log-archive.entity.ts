import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'log_command_archive',
  comment: '명령어 상세 조회 내역 (아카이빙)',
})
export class CommandLogArchiveEntity {
  @PrimaryGeneratedColumn('increment', { comment: 'PK' })
  id: number;

  @CreateDateColumn({
    comment: '로그 저장 일시 (추후 메시지큐 도입 시 accessAt과 차이날 수 있음)',
  })
  createdAt: Date;

  @Column('datetime', {
    comment: '조회 일시',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  accessAt: Date;

  @Column('int', { comment: '명령어 ID (linux_command.id)' })
  commandId: number;

  @Column('int', { comment: '사용자 ID (user.id)', nullable: true })
  userId: number | null;

  @Column('varchar', { comment: '세션 ID' })
  sessionId: string;
}
