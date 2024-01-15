import { action } from '@prisma/client';

export interface ICreateAuthHistory {
  ip: string;
  country: string;
  action: action;
  detail: string;
}
