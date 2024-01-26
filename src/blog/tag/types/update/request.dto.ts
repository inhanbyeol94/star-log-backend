import { IsNotEmpty, IsNumber, IsString } from '@inhanbyeol/class-validator';
import { ITagUpdate } from './request.interface';

export class TagUpdateDto implements ITagUpdate {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class TagUpdateParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}
