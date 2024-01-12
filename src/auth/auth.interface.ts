import { platform } from '@prisma/client';

export interface ISocial {
  id: string;
  profileImage: string;
  platform: platform;
}
