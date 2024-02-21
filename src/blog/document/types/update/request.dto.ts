import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from '@inhanbyeol/class-validator';
import { IDocumentUpdate } from './request.interface';

export class DocumentUpdateDto implements IDocumentUpdate {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  allowComments: boolean;

  @IsBoolean()
  allowPublic: boolean;

  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}

export class DocumentUpdateParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}
