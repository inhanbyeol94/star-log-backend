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

  async oAuthLogin(data: ISocial, ip: string): Promise<string> {
    const member = await this.memberService.findFirstBySocialId(data.id);
    //todo authHistory (시도) 필요

    //회원가입
    if (!member) {
      const createMember = await this.memberService.create(data);
      const accessToken = this.jwtService.sign(createMember);
      await this.redisService.createAccessToken(createMember.id, accessToken);
      //todo authHistory (성공) 필요
      return accessToken;
    }

    //로그인
    const country = await this.getReqIpCountry(ip);
    await this.verify(member, country);
    const accessToken = this.jwtService.sign(member);
    await this.redisService.createAccessToken(member.id, accessToken);
    //todo authHistory (성공) 필요
    return accessToken;
  }

  async logout(memberId: string, accessToken: string): Promise<string> {
    await this.redisService.deleteAccessToken(memberId, accessToken);
    //todo authHistory (로그아웃) 필요
    return '로그아웃이 완료되었습니다.';
  }

  async verify(member: Member, country: string): Promise<void> {
    //블랙리스트 검증
    if (member.blackList) {
      //todo authHistory (실패) 필요
      throw new ForbiddenException('접속이 제한된 계정입니다.');
    }

    //해외로그인 차단 검증
    if (!member.globalAccess && country !== 'KR') {
      //todo authHistory (실패) 필요
      throw new ForbiddenException('해외 로그인이 차단된 계정입니다.');
    }
  }

  async getReqIpCountry(ip: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://apis.data.go.kr/B551505/whois/ipas_country_code?serviceKey=${this.configService.get('GET_REQ_IP_COUNTRY_KEY')}&query=${ip}&answer=json`);
      return res.data.response.whois.countryCode;
    } catch (error) {
      return 'error';
    }
  }
}
