import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class TagFindManyByIdParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
