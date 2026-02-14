import { Controller, Get } from '@nestjs/common';
import { CommandService } from '../app/command.service';
import { CommandCategoryService } from '../app/command-category.service';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('command/category')
export class CommandCategoryController {
  constructor(private readonly service: CommandCategoryService) {}

  @Get('/')
  async getCategoryList() {
    const found = await this.service.getCategoryList();
    return sendSuccessRes({
      list: found,
    });
  }
}
