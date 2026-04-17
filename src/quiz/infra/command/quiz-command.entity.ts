import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { QuizEntity } from '../quiz/quiz.entity';
import { CommandEntity } from 'src/command/infra/entity/command.entity';

@Entity({
  name: 'quiz_command',
  comment: '문제와 관련 명령어의 관계 매핑',
})
export class QuizCommandEntity extends DefaultEntity {
  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;
  @Column('int', { comment: '명령어 ID (linux_command.id)' })
  commandId: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizCommands)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @ManyToOne(() => CommandEntity)
  @JoinColumn({ name: 'commandId' })
  command: CommandEntity;
}
