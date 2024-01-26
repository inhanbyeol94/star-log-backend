import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class TagFindUniqueParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}
