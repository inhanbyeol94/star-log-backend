import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { IPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  /**
   * **액세스 토큰 발급**
   * @param payload
   * @param {number} payload.id 유저 아이디
   * @param {string} payload.nickname 닉네임
   * @param {string} payload.profileImage 프로필 사진 url
   * @param {boolean} payload.isAdmin 관리자 여부
   * @return {string} 액세스 토큰 반환
   * */
  sign(payload: IPayload): string {
    return sign(payload, this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'), { expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') });
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
}
