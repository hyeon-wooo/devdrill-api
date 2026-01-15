import { Controller, Get, Query } from '@nestjs/common';
import { ExamSubjectService } from '../app/subject.service';
import { ExamSubjectListQueryDto } from './dto/subject.dto';
import { ExamSubjectEntity } from '../infra/subject.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('subject')
class ExamSubjectController {
  constructor(private readonly service: ExamSubjectService) {}

  @Get('/')
  async getList(@Query() query: ExamSubjectListQueryDto) {
    const condition: FindOptionsWhere<ExamSubjectEntity> = {};
    if (query.examId) condition.examId = Number(query.examId);

    const options: FindManyOptions<ExamSubjectEntity> = {
      where: condition,
      order: {
        sequence: 'ASC',
      },
    };

    if (query.from) options.skip = query.from;
    if (query.limit) options.take = query.limit;

    const subjects = await this.service.findMany(options);

    const responseData: { list: ExamSubjectEntity[]; totalCount?: number } = {
      list: subjects,
    };
    if (query.needTotalCount) {
      const totalCount = await this.service.count(condition);
      responseData.totalCount = totalCount;
    }

    return sendSuccessRes(responseData);
  }
}
