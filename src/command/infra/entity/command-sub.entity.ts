import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommandEntity } from './command.entity';
import { CommandOptionEntity } from './command-option.entity';

@Entity({ name: 'linux_command_sub', comment: '리눅스 명령어 서브명령어' })
export class CommandSubEntity extends DefaultEntity {
  @Column('varchar', {
    nullable: true,
    length: 20,
    comment: '서브커맨드 이름, null인 경우 기본커맨드',
  })
  name: string | null;

  @Column('varchar', { comment: '서브커맨드 형식' })
  format: string;

  @Column('text', { comment: '기능 및 형식에 대한 설명' })
  description: string;

  @Column('int', { default: 10, comment: '앱 출력 순서 (낮을수록 우선)' })
  displaySequence: number;

  @Column('int', { comment: '명령어 ID (linux_command.id)' })
  commandId: number;

  @ManyToOne(() => CommandEntity, (command) => command.subCommands)
  command: CommandEntity;

  @OneToMany(() => CommandOptionEntity, (option) => option.subCommand)
  options: CommandOptionEntity[];
}
