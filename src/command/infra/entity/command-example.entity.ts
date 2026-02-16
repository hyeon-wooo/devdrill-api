import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommandEntity } from './command.entity';

@Entity({ name: 'linux_command_example', comment: '리눅스 명령어 예시' })
export class CommandExampleEntity extends DefaultEntity {
  @Column('text', { comment: '예시 스크립트' })
  script: string;

  @Column({ comment: '설명' })
  description: string;

  @Column('int', { default: 10, comment: '출력 순서 (낮을수록 우선)' })
  displaySequence: number;

  @Column('int', { comment: '명령어 ID (linux_command.id)' })
  commandId: number;

  @ManyToOne(() => CommandEntity, (command) => command.examples)
  command: CommandEntity;
}
