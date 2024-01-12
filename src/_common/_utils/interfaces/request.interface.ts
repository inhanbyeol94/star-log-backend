import { Request } from 'express';
import { IPayload } from '../../jwt/jwt.interface';
import { platform } from '@prisma/client';

export interface IRequest extends Request {
  social: {
    id: number;
    profileImage: string;
    platform: platform;
  };
  member: IPayload;
}
