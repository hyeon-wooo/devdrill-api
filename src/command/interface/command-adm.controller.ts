import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CommandCreateBodyDto,
  CommandListQueryDto,
  CommandSubCreateBodyDto,
  CommandSubUpdateBodyDto,
  CommandUpdateBodyDto,
} from './dto/command.dto';
import { CommandAdmService } from '../app/command-adm.service';
import { sendSuccessRes } from 'src/common/generateResponse';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/role.decorator';
import { ERole } from 'src/auth/role/role.enum';
import { RedisService } from 'src/redis/redis.service';

@Controller('adm/command')
@Roles(ERole.ADM)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommandAdmController {
  constructor(
    private service: CommandAdmService,
    private readonly redisService: RedisService,
  ) {}

  /** 명령어 목록 */
  @Get('/')
  async getList(@Query() query: CommandListQueryDto) {
    const result = await this.service.getCommandList(query);
    return sendSuccessRes(result);
  }

  /** 서브커맨드 상세 */
  @Get('/:id/sub/:subId')
  async getSubDetail(@Param('subId') subIdStr: string) {
    const subId = Number(subIdStr);
    const found = await this.service.getSubDetail(subId);
    return sendSuccessRes({ subCommand: found });
  }

  /** 명령어 상세 */
  @Get('/:id')
  async getDetail(@Param('id') idStr: string) {
    const id = Number(idStr);
    const found = await this.service.getCommandDetail(id);
    return sendSuccessRes({ command: found });
  }

  /** 명령어 생성 */
  @Post('/')
  async createCommand(@Body() body: CommandCreateBodyDto) {
    const created = await this.service.createCommand(body);
    return sendSuccessRes({ id: created.id });
  }

  /** 서브커맨드 생성 */
  @Post('/:id/sub')
  async createSubCommand(
    @Param('id') idStr: string,
    @Body() body: CommandSubCreateBodyDto,
  ) {
    const id = Number(idStr);
    const created = await this.service.createSubCommand(id, body);
    return sendSuccessRes({ id: created.id });
  }

  /** 서브커맨드 수정 */
  @Put('/:id/sub/:subId')
  async updateSubCommand(
    @Param('id') commandIdStr: string,
    @Param('subId') subIdStr: string,
    @Body() body: CommandSubUpdateBodyDto,
  ) {
    const commandId = Number(commandIdStr);
    const subId = Number(subIdStr);
    await this.service.updateSubCommand(subId, body);
    this.redisService.delCommandCache(commandId);
    return sendSuccessRes(true);
  }

  /** 명령어 수정 */
  @Put('/:id')
  async updateCommand(
    @Param('id') idStr: string,
    @Body() body: CommandUpdateBodyDto,
  ) {
    const id = Number(idStr);
    await this.service.updateCommand(id, body);
    this.redisService.delCommandCache(id);
    return sendSuccessRes(true);
  }
}
