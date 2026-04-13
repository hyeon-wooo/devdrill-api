import { Controller, Get } from '@nestjs/common';
import { TechService } from '../app/tech.service';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('tech')
export class TechController {
  constructor(private readonly service: TechService) {}

  @Get('/')
  async getList() {
    const list = await this.service.getList();

    return sendSuccessRes({ list });
  }
}
