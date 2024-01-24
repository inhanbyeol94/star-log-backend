import { PaginationDto } from '../../../../_common/_utils/dtos/request.dto';
import { IAuthHistoryFindManyAndMetadata } from './request.interface';

export class AuthHistoryFindManyAndMetadataDto extends PaginationDto implements IAuthHistoryFindManyAndMetadata {}
