import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { IPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';
import { Member } from '@prisma/client';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(member: Member): string {
    const { id, email, nickname, isAdmin, profileImage } = member;
    return sign({ id, email, nickname, isAdmin, profileImage }, this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY')!, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN')!,
    });
  }

  verify(accessToken: string): IPayload | string {
    try {
      return verify(accessToken, this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY')!) as IPayload;
    } catch (error) {
      return error.message as string;
    }
  }
}
