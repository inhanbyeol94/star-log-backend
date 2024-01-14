import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from '@inhanbyeol/class-validator';
import { blogRegex } from './blog.regex';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: string;

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

export class UpdateBlogDto {
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
