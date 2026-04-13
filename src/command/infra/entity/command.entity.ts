import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ECommandImportance, ETopic } from '../../domain/command.enum';
import { CommandCategoryEntity } from './command-category.entity';
import { CommandSubEntity } from './command-sub.entity';
import { CommandExampleEntity } from './command-example.entity';
import { TechEntity } from 'src/tech/infra/tech.entity';

@Entity({ name: 'linux_command', comment: '리눅스 명령어' })
export class CommandEntity extends DefaultEntity {
  @Column({ length: 20, comment: '명령어 이름' })
  name: string;

  @Column({ comment: '설명' })
  description: string;

  @Column('int', { default: 0, comment: '추천 수' })
  cntLike: number;

  @Column('enum', {
    enum: ECommandImportance,
    comment: '중요도 (IMPORTANT=중요/NORMAL=일반/LOW=낮음)',
  })
  importance: ECommandImportance;

  @Column('boolean', { default: true, comment: '공개 여부' })
  isPublic: boolean;

  @Column('boolean', { default: false, comment: '프리미엄 여부' })
  isPremium: boolean;

  @Column('int', { default: 10, comment: '앱 출력 순서 (낮을수록 우선)' })
  displaySequence: number;

  @Column('int', { default: 1000, comment: '캐시 만료시간 (초)' })
  ttl: number;

  @Column('int', { comment: '카테고리 ID (linux_command_category.id)' })
  categoryId: number;

  @ManyToOne(() => CommandCategoryEntity, (category) => category.commands)
  category: CommandCategoryEntity;

  @Column('int', { comment: '기술스택 ID (tech.id)' })
  techId: number;

  @OneToMany(() => CommandSubEntity, (sub) => sub.command)
  subCommands: CommandSubEntity[];

  @OneToMany(() => CommandExampleEntity, (example) => example.command)
  examples: CommandExampleEntity[];
}
