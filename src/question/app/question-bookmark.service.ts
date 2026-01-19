import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { In, Repository } from 'typeorm';
import { QuestionBookmarkEntity } from '../infra/question-bookmark.entity';

@Injectable()
export class QuestionBookmarkService extends CRUDService<QuestionBookmarkEntity> {
  constructor(@InjectRepository(QuestionBookmarkEntity) repo: Repository<QuestionBookmarkEntity>) {super(repo);}

  async getBookmarkMap(questionIds: number[], userId: number) {
    const bookmarks = await this.findMany({
      where: { questionId: In(questionIds), userId },
      order: { questionId: 'ASC' },
    });

    const bookmarkMap: Record<number, boolean> = bookmarks.reduce((acc, cur) => {
      acc[cur.questionId] = true;

      return acc;
    }, questionIds.reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {}));

    return bookmarkMap;
  }
}