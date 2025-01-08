import { SelectQueryBuilder } from 'typeorm';
import { Expose } from 'class-transformer';

export interface PaginateOptions {
  currentPage: number;
  limit: number;
  total?: boolean;
}

export class PaginationResults<T> {
  constructor(partial: Partial<PaginationResults<T>>) {
    Object.assign(this, partial);
  }
  @Expose()
  first: number;
  @Expose()
  last: number;
  @Expose()
  limit: number;
  @Expose()
  total?: number;
  @Expose()
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = { currentPage: 1, limit: 10 },
): Promise<PaginationResults<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();
  return new PaginationResults({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : undefined,
    data,
  });
}
