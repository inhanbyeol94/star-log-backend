import { PaginationDto } from '../../../../../_common/_utils/dtos/request.dto';
import { ICommentFindManyAndMetaData } from './request.interface';
import { IsIn, IsNotEmpty, IsOptional, IsString } from '@inhanbyeol/class-validator';

export class CommentFindManyAndMetaDataDto extends PaginationDto implements ICommentFindManyAndMetaData {
  @IsOptional()
  @IsIn(['content', 'nickname'])
  searchBy?: string;

  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @IsNotEmpty()
  @IsIn(['content'])
  orderBy: string = 'content';

  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  sortOrder: string = 'desc';
}
