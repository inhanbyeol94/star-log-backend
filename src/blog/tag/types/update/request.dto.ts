import { IsNotEmpty, IsString } from '@inhanbyeol/class-validator';
import { ITagUpdate } from './request.interface';

export class TagUpdateDto implements ITagUpdate {
  @IsNotEmpty()
  @IsString()
  name: string;
}
