import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NoticeService } from '../app/notice.service';
import { sendSuccessRes } from 'src/common/generateResponse';
import { ListQueryDto } from 'src/common/default.dto';
import { FindManyOptions, FindOptionsWhere, Like } from 'typeorm';
import { NoticeEntity } from '../infra/notice.entity';
import { NoticeCreateBodyDto, NoticeUpdateBodyDto } from './notice.dto';

@Controller('notice')
export class NoticeController {
    constructor(private readonly service: NoticeService) {}

    @Get('/')
    async getList(@Query() query: ListQueryDto & {withInactive?: 'y' | 'n'}) {
        const from = Number(query.from) || 0;
        const limit = Number(query.limit) || 20;

        const condition: FindOptionsWhere<NoticeEntity> = {};
        if (query.searchKeyword)
          condition.title = Like(`%${query.searchKeyword}%`);
        if (query.withInactive !== 'y')
          condition.isActive = true;
        const options: FindManyOptions<NoticeEntity> = {
          where: condition,
          skip: from,
          take: limit,
          order: {
            isFixed: 'DESC',
            createdAt: 'DESC',
          },
          select: ['id', 'title', 'isActive', 'isFixed', 'createdAt']
        };
        const notices = await this.service.findMany(options);

        let totalCount: number | undefined;
        if (query.needTotalCount === 'y')
          totalCount = await this.service.count(condition);

        return sendSuccessRes({ list: notices, totalCount });
    }

    @Get('/:id')
    async get(@Param('id') idStr: string) {
        const id = Number(idStr);
        const notice = await this.service.findOne({ id });

        return sendSuccessRes({ notice });
    }

    @Post('/')
    async create(@Body() body: NoticeCreateBodyDto) {
        const created = await this.service.create(body);
        const notice = created[0];
        return sendSuccessRes({ id: notice.id });
    }

    @Put('/:id')
    async update(@Param('id') idStr: string, @Body() body: NoticeUpdateBodyDto) {
        const id = Number(idStr);
        const updated = await this.service.update({ id }, body);
        return sendSuccessRes(true);
    }

    @Delete('/:id')
    async delete(@Param('id') idStr: string) {
        const id = Number(idStr);
        await this.service.deleteMany([id]);
        return sendSuccessRes(true);
    }
}
