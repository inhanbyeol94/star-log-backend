import { IsNotEmpty, IsNumber, IsString } from '@inhanbyeol/class-validator';
import { ITagCreate } from './request.interface';

export class TagCreateDto implements ITagCreate {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}
