import { IsNotEmpty, IsNumber } from '@inhanbyeol/class-validator';

export class DocumentDeleteParamDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}
