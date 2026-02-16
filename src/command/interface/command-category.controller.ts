import { Controller, Get } from '@nestjs/common';
import { CommandCategoryService } from '../app/command-category.service';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('command/category')
export class CommandCategoryController {
  constructor(private readonly service: CommandCategoryService) {}

  @Get('/name')
  async getCategoryNameList() {
    const found = await this.service.getCategoryNameList();
    return sendSuccessRes({
      list: found,
    });
  }
}
