import { IsBoolean, IsOptional, IsString } from '@inhanbyeol/class-validator';
import { IUpdateUser } from './member.interface';

/** **업데이트 DTO** */
export class UpdateMemberDto implements IUpdateUser {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsBoolean()
  globalAccess?: boolean;
}
