import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from '@inhanbyeol/class-validator';
import { blogRegex } from './blog.regex';
import { ICreateBlog, IPaginationBlog, IUpdateBlog } from './blog.interface';
import { PaginationDto } from '../_common/_utils/dtos/request.dto';

export class CreateBlogDto implements ICreateBlog {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(10)
  @Matches(blogRegex.address)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  @Matches(blogRegex.title)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  @Matches(blogRegex.description)
  description: string;
}

export class UpdateBlogDto implements IUpdateBlog {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(10)
  @Matches(blogRegex.address)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  @Matches(blogRegex.title)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  @Matches(blogRegex.description)
  description: string;
}

export class BlogIdDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class BlogAddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class PaginationBlogDto extends PaginationDto implements IPaginationBlog {
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
