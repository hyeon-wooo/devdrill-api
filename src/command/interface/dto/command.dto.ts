import { PartialType } from '@nestjs/mapped-types';
import { ECommandImportance } from 'src/command/domain/command.enum';
import { ListQueryDto } from 'src/common/default.dto';

/** 커맨드 */
export class CommandListQueryDto extends ListQueryDto {
  categoryId?: string;
}

export class CommandCreateBodyDto {
  name: string;
  description: string;
  importance: ECommandImportance;
  isPublic: boolean;
  isPremium: boolean;
  displaySequence: number;
  categoryId: number;

  examples: {
    script: string;
    description: string;
    displaySequence: number;
  }[];
}
export class CommandUpdateBodyDto extends PartialType(CommandCreateBodyDto) {}

/** 서브커맨드 */
export class CommandSubCreateBodyDto {
  name: string | null;
  format: string;
  description: string;
  displaySequence: number;

  options: {
    name: string;
    description: string;
    displaySequence: number;
  }[];
}
export class CommandSubUpdateBodyDto extends PartialType(
  CommandSubCreateBodyDto,
) {}
