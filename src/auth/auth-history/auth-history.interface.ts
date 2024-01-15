import { action, AuthHistory } from '@prisma/client';
import { IPagination } from '../../_common/_utils/interfaces/request.interface';

export interface IPaginationAuthHistory extends IPagination {}

export interface ICreateAuthHistory {
  ip: string;
  country: string;
  action: action;
  detail: string;
}

export interface IAuthHistory extends AuthHistory {}
