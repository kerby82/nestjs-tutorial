import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  currentPage: number;
  limit: number;
  total?: boolean;
}

export interface PaginationResults<T> {
  first: number;
  last: number;
  limit: number;
  total?: number;
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = { currentPage: 1, limit: 10 },
): Promise<PaginationResults<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();
  return {
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : undefined,
    data,
  };
}
