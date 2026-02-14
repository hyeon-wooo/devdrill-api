import { ECommandMastery } from 'src/command/domain/command.enum';
import { DefaultEntity } from 'src/common/default.entity';
import { UserEntity } from 'src/user/infra/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommandEntity } from './command.entity';

@Entity({ name: 'linux_command_mastery', comment: '리눅스 명령어 숙련도' })
export class CommandMasteryEntity extends DefaultEntity {
  @Column('int', { comment: '사용자ID (user.id)' })
  userId: number;

  @Column('int', { comment: '명령어ID (linux_command.id)' })
  commandId: number;

  @Column('enum', { enum: ECommandMastery, comment: '숙련도' })
  mastery: ECommandMastery;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CommandEntity)
  command: CommandEntity;
}
