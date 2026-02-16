import { Injectable } from '@nestjs/common';
import { CommandCategoryRepository } from '../infra/repository/command-category.repository';

@Injectable()
export class CommandCategoryService {
  constructor(private readonly repo: CommandCategoryRepository) {}

  async getCategoryNameList() {
    return this.repo.findMany({
      select: ['id', 'name'],
      order: { displaySequence: 'ASC' },
    });
  }
}
