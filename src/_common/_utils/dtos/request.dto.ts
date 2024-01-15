import { IsNotEmpty, IsNumber, IsOptional } from '@inhanbyeol/class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  take: number = 20;
}
