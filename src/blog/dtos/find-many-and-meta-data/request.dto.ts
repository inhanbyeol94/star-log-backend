import { PaginationDto } from '../../../_common/_utils/dtos/request.dto';
import { IBlogFindManyAndMetaData } from './request.interface';
import { IsIn, IsNotEmpty, IsOptional, IsString } from '@inhanbyeol/class-validator';

export class BlogFindManyAndMetaDataDto extends PaginationDto implements IBlogFindManyAndMetaData {
  @IsOptional()
  @IsIn(['title', 'tags', 'nickname'])
  searchBy?: string;

  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @IsNotEmpty()
  @IsIn(['title'])
  orderBy: string = 'title';

  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  sortOrder: string = 'desc';
}
