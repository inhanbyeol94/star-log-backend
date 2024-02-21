import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from '@inhanbyeol/class-validator';
import { IDocumentCreate } from './request.interface';

export class DocumentCreateDto implements IDocumentCreate {
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

export class DocumentCreateParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
