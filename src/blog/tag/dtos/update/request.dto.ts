import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from '@inhanbyeol/class-validator';

export class TagUpdateDto implements Prisma.TagUpdateInput {
  @IsNotEmpty()
  @IsString()
  name: string;
}
