import { IsNotEmpty, IsString } from '@inhanbyeol/class-validator';

export class BlogAddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
