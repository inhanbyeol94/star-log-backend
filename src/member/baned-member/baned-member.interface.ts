export interface IBanedMember {
  email?: string;
  nickname?: string;
  phoneNumber?: string;
  profileImage?: string;
  globalAccess?: boolean;
}

export interface IBanedMemberInfo {
  memberId: string;
  reason: string;
  limitedAt: Date;
}
