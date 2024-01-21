import { Injectable } from '@nestjs/common';
import { IPagination } from '../_utils/interfaces/request.interface';
import { IMetaData } from './pagination.interface';

@Injectable()
export class PaginationService {
  metaData(allCount: number, data: IPagination): IMetaData {
    return { meta: { currentPage: data.page, maxPage: Math.ceil(allCount / data.take), allCount, take: data.take } };
  }
}
