import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from '@inhanbyeol/class-validator';

export class TagCreateDto implements Prisma.TagUncheckedCreateInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}
