import { IsBoolean, IsOptional, IsString } from '@inhanbyeol/class-validator';
import { IMemberUpdate } from './member.interface';

/** **업데이트 DTO** */
export class MemberUpdateDto implements IMemberUpdate {
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
