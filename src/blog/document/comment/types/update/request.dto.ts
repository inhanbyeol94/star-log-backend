import { IsBoolean, IsNotEmpty, IsNumber, IsString } from '@inhanbyeol/class-validator';
import { ICommentUpdate } from './request.interface';

export class CommentUpdateDto implements ICommentUpdate {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  allowPublic: boolean;

  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}

export class CommentUpdateParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}
