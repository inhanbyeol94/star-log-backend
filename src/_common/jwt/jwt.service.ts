import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { IPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';
import { Member } from '@prisma/client';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  /**
   * **액세스 토큰 발급**
   * @param member schema
   * @return {string} 액세스 토큰 반환
   * */
  sign(member: Member): string {
    return sign(this.payload(member), this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'), { expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') });
  }

  /**
   * **액세스 토큰 검증**
   * @param {string} accessToken 액세스 토큰
   * @throws {UnauthorizedException} 토큰오류 반환
   * @return payload 반환
   * */
  verify(accessToken: string): IPayload {
    try {
      return verify(accessToken, this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY')) as IPayload;
    } catch (error) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  /**
   * **Payload 반환**
   * @param member schema
   * @return IPayload payload
   * */
  payload(member: Member): IPayload {
    const { id, email, nickname, isAdmin, profileImage } = member;
    return { id, email, nickname, isAdmin, profileImage };
  }
}
