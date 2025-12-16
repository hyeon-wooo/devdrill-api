import {
  DeepPartial,
  FindManyOptions,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type TUpdateEntry<T> = [T, DeepPartial<T>];
export interface ISearchArg<TEntity> {
  keyword: string;
  columns: (keyof TEntity)[];
}

export abstract class CRUDService<TEntity extends ObjectLiteral> {
  constructor(protected repo: Repository<TEntity>) {}

  count(withDeleted: boolean = false) {
    return this.repo.count({ withDeleted });
  }

  findOne(
    condition: FindOptionsWhere<TEntity>,
    relations?: FindOptionsRelationByString | FindOptionsRelations<TEntity>,
  ): Promise<TEntity | null> {
    return this.repo.findOne({ where: condition, relations });
  }

  findMany(findOptions: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repo.find(findOptions);
  }

  findAll(select?: (keyof TEntity)[]) {
    if (select) return this.repo.find({ select });
    return this.repo.find();
  }

  async create(data: DeepPartial<TEntity>[]): Promise<TEntity[]>;
  async create(data: DeepPartial<TEntity>): Promise<TEntity[]>;
  async create(
    param: DeepPartial<TEntity> | DeepPartial<TEntity>[],
  ): Promise<TEntity | TEntity[]> {
    let creating;
    if (Array.isArray(param)) {
      creating = param.map((data) => this.repo.create(data));
    } else creating = [await this.repo.create(param)];

    const created = await this.repo.save(creating);
    return created;
  }

  async update(
    condition: FindOptionsWhere<TEntity>,
    data: QueryDeepPartialEntity<TEntity>,
  ) {
    return this.repo.update(condition, data);
  }

  async updateWithMerge(origin: TEntity, changed: DeepPartial<TEntity>) {
    const merged = this.repo.merge(origin, changed) as DeepPartial<TEntity>;
    return this.repo.save(merged);
  }

  async updateMany(entries: TUpdateEntry<TEntity>[]) {
    const mergedEntities = entries.map(
      ([origin, changed]) =>
        this.repo.merge(origin, changed) as DeepPartial<TEntity>,
    );

    return this.repo.save(mergedEntities);
  }

  async save(entities: DeepPartial<TEntity>[]) {
    return this.repo.save(entities);
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    await this.repo.softDelete(ids);

    return true;
  }

  async deleteWithWhere(
    condition: FindOptionsWhere<TEntity>,
  ): Promise<boolean> {
    await this.repo.softDelete(condition);

    return true;
  }

  async deleteTestingData(ids: string[]): Promise<boolean> {
    await this.repo.delete(ids);
    return true;
  }
}
