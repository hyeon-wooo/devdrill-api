import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommandSubEntity } from './command-sub.entity';

@Entity({ name: 'linux_command_option', comment: '리눅스 명령어 옵션' })
export class CommandOptionEntity extends DefaultEntity {
  @Column('varchar', { length: 100, comment: '옵션 이름' })
  name: string;

  @Column('text', { comment: '설명' })
  description: string;

  @Column('int', { default: 10, comment: '앱 출력 순서 (낮을수록 우선)' })
  displaySequence: number;

  @Column('int', { comment: '서브커맨드 ID (linux_command_sub.id)' })
  subCommandId: number;

  @ManyToOne(() => CommandSubEntity, (subCommand) => subCommand.options)
  subCommand: CommandSubEntity;
}
