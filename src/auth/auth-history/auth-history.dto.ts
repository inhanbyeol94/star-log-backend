import { PaginationDto } from '../../_common/_utils/dtos/request.dto';
import { IPaginationAuthHistory } from './auth-history.interface';

export class AuthHistoryPaginationDto extends PaginationDto implements IPaginationAuthHistory {}
