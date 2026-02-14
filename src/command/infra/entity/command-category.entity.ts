import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'linux_command_category', comment: '리눅스 명령어 카테고리' })
export class CommandCategoryEntity extends DefaultEntity {
  @Column({ length: 20, comment: '카테고리명' })
  name: string;

  @Column('varchar', { nullable: true, comment: '설명' })
  description: string | null;

  @Column('int', { default: 10, comment: '앱 출력 순서 (낮을수록 우선)' })
  displaySequence: number;
}
