import { ForbiddenException, Injectable } from '@nestjs/common';
import { ISocial } from './auth.interface';
import { MemberService } from '../member/member.service';
import { JwtService } from '../_common/jwt/jwt.service';
import { Member } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from '../_common/redis/redis.service';
import { logger } from '../_common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  /**
   * **소셜 로그인 (공통)**
   * @param data
   * @param data.id 소셜 아이디
   * @param data.platform 소셜 구분
   * @param data.profileImage 프로필 사진
   * @param ip 접속 아이피
   * @remarks 기존 회원일 경우 토큰반환하나, 미등록 회원일 경우 생성 후 토큰을 반환합니다.
   * @return 액세스토큰 반환
   * */
  async oAuthLogin(data: ISocial, ip: string): Promise<string> {
    const member = await this.memberService.findFirstBySocialId(data.id);

    //회원가입
    if (!member) {
      const createMember = await this.memberService.create(data);
      const accessToken = this.jwtService.sign(createMember);
      await this.redisService.setAccessToken(createMember.id, accessToken);
      return accessToken;
    }

    //로그인
    const country = await this.getReqIpCountry(ip);
    await this.verify(member, country);
    const accessToken = this.jwtService.sign(member);
    await this.redisService.setAccessToken(member.id, accessToken);

    return accessToken;
  }

  async verify(member: Member, country: string): Promise<void> {
    //블랙리스트 검증
    if (member.blackList) {
      logger.error('', 'ForbiddenException');
      throw new ForbiddenException('접속이 제한된 계정입니다.');
    }

    //해외로그인 차단 검증
    if (!member.globalAccess && country !== 'KR') {
      logger.error('', 'ForbiddenException');
      throw new ForbiddenException('해외 로그인이 차단된 계정입니다.');
    }
  }

  /**
   * **WHOIS OPEN API (ip 국가 조회)**
   * @return 국가코드
   * */
  async getReqIpCountry(ip: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://apis.data.go.kr/B551505/whois/ipas_country_code?serviceKey=${this.configService.get('GET_REQ_IP_COUNTRY_KEY')}&query=${ip}&answer=json`);
      return res.data.response.whois.countryCode;
    } catch (error) {
      return 'error';
    }
  }
}
