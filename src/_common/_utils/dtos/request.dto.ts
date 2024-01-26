import { IsNumber, IsOptional } from '@inhanbyeol/class-validator';
import { Max, Min } from 'class-validator';
import { IPagination } from '../interfaces/request.interface';

export class PaginationDto implements IPagination {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Max(50)
  @Min(1)
  take: number = 20;
}
