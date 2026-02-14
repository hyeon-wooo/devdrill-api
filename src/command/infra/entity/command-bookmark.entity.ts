import { DefaultEntity } from 'src/common/default.entity';
import { UserEntity } from 'src/user/infra/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommandEntity } from './command.entity';

@Entity({
  name: 'linux_command_bookmark',
  comment: '리눅스 명령어 북마크 내역',
})
export class CommandBookmarkEntity extends DefaultEntity {
  @Column('int', { comment: '사용자ID (user.id)' })
  userId: number;

  @Column('int', { comment: '명령어ID (linux_command.id)' })
  commandId: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CommandEntity)
  command: CommandEntity;
}
