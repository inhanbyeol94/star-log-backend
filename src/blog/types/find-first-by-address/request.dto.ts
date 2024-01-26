import { IsNotEmpty, IsString } from '@inhanbyeol/class-validator';

export class BlogFindFirstByAddressParamDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
