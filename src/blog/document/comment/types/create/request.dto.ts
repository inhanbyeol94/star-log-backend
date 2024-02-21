import { IsBoolean, IsNotEmpty, IsNumber, IsString } from '@inhanbyeol/class-validator';
import { ICommentCreate } from './request.interface';

export class CommentCreateDto implements ICommentCreate {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  allowPublic: boolean;

  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}

export class CommentCreateParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
