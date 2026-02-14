import { Controller } from '@nestjs/common';
import { CommandService } from '../app/command.service';

@Controller('command')
export class CommandController {
  constructor(private readonly service: CommandService) {}
}
