import { Module } from '@nestjs/common';
import { CommandController } from './interface/command.controller';
import { CommandService } from './app/command.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './infra/entity/command.entity';
import { CommandCategoryEntity } from './infra/entity/command-category.entity';
import { CommandLikeEntity } from './infra/entity/command-like.entity';
import { CommandMasteryEntity } from './infra/entity/command-mastery.entity';
import { CommandBookmarkEntity } from './infra/entity/command-bookmark.entity';
import { CommandRepository } from './infra/repository/command.repository';
import { CommandCategoryRepository } from './infra/repository/command-category.repository';
import { CommandLikeRepository } from './infra/repository/command-like.repository';
import { CommandMasteryRepository } from './infra/repository/command-mastery.repository';
import { CommandBookmarkRepository } from './infra/repository/command-bookmark.repository';
import { CommandCategoryController } from './interface/command-category.controller';
import { CommandCategoryService } from './app/command-category.service';
import { CommandSubEntity } from './infra/entity/command-sub.entity';
import { CommandOptionEntity } from './infra/entity/command-option.entity';
import { CommandSubRepository } from './infra/repository/command-sub.repository';
import { CommandOptionRepository } from './infra/repository/command-options.repository';
import { CommandExampleEntity } from './infra/entity/command-example.entity';
import { CommandExampleRepository } from './infra/repository/command-example.repository';
import { CommandAdmController } from './interface/command-adm.controller';
import { CommandAdmService } from './app/command-adm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandEntity,
      CommandCategoryEntity,
      CommandLikeEntity,
      CommandMasteryEntity,
      CommandBookmarkEntity,
      CommandSubEntity,
      CommandOptionEntity,
      CommandExampleEntity,
    ]),
  ],
  controllers: [
    CommandController,
    CommandCategoryController,
    CommandAdmController,
  ],
  providers: [
    CommandRepository,
    CommandCategoryRepository,
    CommandLikeRepository,
    CommandMasteryRepository,
    CommandBookmarkRepository,
    CommandSubRepository,
    CommandOptionRepository,
    CommandExampleRepository,

    CommandService,
    CommandCategoryService,
    CommandAdmService,
  ],
})
export class CommandModule {}
