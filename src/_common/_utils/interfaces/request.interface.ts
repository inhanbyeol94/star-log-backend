import { Request } from 'express';
import { IPayload } from '../../jwt/jwt.interface';
import { ISocial } from '../../../auth/interfaces/social.interface';

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
