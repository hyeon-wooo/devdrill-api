import { Injectable } from '@nestjs/common';
import { CommandCategoryRepository } from '../infra/repository/command-category.repository';

@Injectable()
export class CommandCategoryService {
  constructor(private readonly repo: CommandCategoryRepository) {}

  async getCategoryList() {
    return this.repo.findMany({
      select: ['id', 'name', 'description', 'displaySequence'],
      order: { displaySequence: 'ASC' },
    });
  }
}
