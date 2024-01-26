import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class BlogDeleteParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
