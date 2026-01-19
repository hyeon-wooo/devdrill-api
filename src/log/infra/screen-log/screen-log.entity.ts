import { DefaultEntity } from "src/common/default.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'log_screen', comment: '화면 전환 로그'})
export class ScreenLogEntity {
    @PrimaryGeneratedColumn('increment', {comment: 'PK'})
    id: number

    @Column('datetime', {comment: '화면 전환 일시', default: () => 'CURRENT_TIMESTAMP', precision: 3})
    enterAt: Date;

    @Column('varchar', {comment: '세션 ID'})
    sessionId: string;

    @Column('int', {comment: '사용자 ID (user.id)', nullable: true})
    userId: number | null;

    @Column('varchar', {comment: '화면 이름'})
    screenName: string;

    @Column('text', {comment: '파라미터', nullable: true})
    params: string | null;
}