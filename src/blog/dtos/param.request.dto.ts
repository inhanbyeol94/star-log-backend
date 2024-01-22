import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class BlogParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class BlogAndTagParamDto extends BlogParamDto {
  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}
