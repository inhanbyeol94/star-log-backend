import { IPagination } from '../../../../../_common/_utils/interfaces/request.interface';

export interface ICommentFindManyAndMetaData extends IPagination {
  searchBy?: string;
  searchKeyword?: string;
  orderBy: string;
  sortOrder: string;
}
