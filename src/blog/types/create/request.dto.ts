import { IsNotEmpty, IsString, MaxLength, MinLength } from '@inhanbyeol/class-validator';
import { IBlogCreate } from './request.interface';

export class BlogCreateDto implements IBlogCreate {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(10)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  description: string;
}
