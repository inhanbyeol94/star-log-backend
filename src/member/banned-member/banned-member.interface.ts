export interface IBannedMember {
  memberId?: string;
  email?: string;
  nickname?: string;
  phoneNumber?: string;
  profileImage?: string;
  globalAccess?: boolean;
}

export interface IBannedMemberInfo {
  reason: string;
  limitedAt: Date;
}
