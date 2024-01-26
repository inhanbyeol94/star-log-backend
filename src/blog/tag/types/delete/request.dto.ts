import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class TagDeleteParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}
