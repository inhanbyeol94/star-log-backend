import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class BlogFindUniqueParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
