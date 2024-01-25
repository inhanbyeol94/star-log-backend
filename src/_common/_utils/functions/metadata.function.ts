import { IPagination } from '../interfaces/request.interface';
import { IMetaData } from '../interfaces/metadata.interface';

export const findManyMetadata = (allCount: number, data: IPagination): IMetaData => {
  return { meta: { currentPage: data.page, maxPage: Math.ceil(allCount / data.take), allCount, take: data.take } };
};
