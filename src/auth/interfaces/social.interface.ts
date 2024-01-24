import { platform } from '@prisma/client';

export interface ISocial {
  id: string;
  profileImage: string;
  email?: string;
  nickname?: string;
  platform: platform;
}
