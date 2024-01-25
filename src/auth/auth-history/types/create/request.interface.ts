import { $Enums } from '.prisma/client';

export interface IAuthHistoryCreate {
  ip: string;
  country: string;
  action: $Enums.action;
  detail: string;
}
