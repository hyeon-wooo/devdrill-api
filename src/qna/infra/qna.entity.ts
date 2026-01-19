import { DefaultEntity } from "src/common/default.entity";
import { UserEntity } from "src/user/infra/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name: 'qna', comment: '문의하기'})
export class QnaEntity extends DefaultEntity {
    @Column('varchar', {comment: '제목'})
    title: string;

    @Column('text', {comment: '내용'})
    content: string;

    @Column('text', {comment: '답변', nullable: true})
    answer: string | null;

    @Column('datetime', {comment: '답변 일시', nullable: true})
    answerAt: Date | null;

    @Column('int', {comment: '사용자 ID (user.id)'})
    userId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'userId'})
    user: UserEntity;
}