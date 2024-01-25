import { Request } from 'express';
import { IPayload } from '../../jwt/types/payload.interface';
import { ISocial } from '../../../auth/types/o-auth/request.interface';

export interface IRequest extends Request {
  social: ISocial;
  member: IPayload;
}

export interface IPagination {
  page: number;
  take: number;
}

export interface IIpAndCountry {
  ip: string;
  country: string;
}
