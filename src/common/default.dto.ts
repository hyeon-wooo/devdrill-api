export class DefaultDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class ListQueryDto {
  from?: number;

  limit?: number;

  searchKeyword?: string;
  searchField?: string;

  needTotalCount?: 'y' | 'n';
}
