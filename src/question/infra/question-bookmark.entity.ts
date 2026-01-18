import { DefaultEntity } from "src/common/default.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { QuestionEntity } from "./question.entity";
import { UserEntity } from "src/user/infra/user.entity";

@Entity({name: 'question_bookmark', comment: '문제 즐겨찾기'})
export class QuestionBookmarkEntity extends DefaultEntity {
    @Column('int', {comment: '시험 ID'})
    examId: number;

    @Column('int', {comment: '문제 ID'})
    questionId: number;

    @Column('int', {comment: '사용자 ID'})
    userId: number;

    @ManyToOne(() => QuestionEntity)
    @JoinColumn({name: 'questionId'})
    question: QuestionEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'userId'})
    user: UserEntity;
}