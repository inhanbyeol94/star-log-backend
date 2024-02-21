import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class CommentDeleteParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}
