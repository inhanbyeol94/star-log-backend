import { IsBoolean, IsOptional, IsString } from '@inhanbyeol/class-validator';
import { IUserUpdate } from './member.interface';

/** **업데이트 DTO** */
export class MemberUpdateDto implements IUserUpdate {
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
