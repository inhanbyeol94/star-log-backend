import { IsIn, IsNotEmpty, IsOptional, IsString } from '@inhanbyeol/class-validator';
import { PaginationDto } from '../../../../_common/_utils/dtos/request.dto';
import { IDocumentFindManyAndMetaData } from './request.interface';

export class DocumentFindManyAndMetaDataDto extends PaginationDto implements IDocumentFindManyAndMetaData {
  @IsOptional()
  @IsIn(['title', 'tags', 'content'])
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
