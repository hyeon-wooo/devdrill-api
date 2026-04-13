import { Injectable } from '@nestjs/common';
import { TechRepository } from '../infra/tech.repository';

@Injectable()
export class TechService {
  constructor(private readonly repo: TechRepository) {}

  async getList() {
    return this.repo.findMany({
      order: { displaySequence: 'ASC' },
    });
  }
}
