import { ForbiddenException, Injectable } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { JwtService } from '../_common/jwt/jwt.service';
import { action, Member } from '@prisma/client';
import { RedisService } from '../_common/redis/redis.service';
import { AuthHistoryService } from './auth-history/auth-history.service';
import { IPaginationAuthHistory } from './auth-history/auth-history.interface';
import { IIpAndCountry } from '../_common/_utils/interfaces/request.interface';
import { BannedMemberService } from '../member/banned-member/banned-member.service';
import { ISocial } from './interfaces/social.interface';

@Injectable()
export class AuthService {
  constructor(
    private authHistoryService: AuthHistoryService,
    private memberService: MemberService,
    private bannedMemberService: BannedMemberService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async oAuthLogin(data: ISocial, ipAndCountry: IIpAndCountry): Promise<string> {
    const { ip, country } = ipAndCountry;
    const member = await this.memberService.findFirstBySocialId(data.id);
    //회원가입
    if (!member) {
      const createMember = await this.memberService.create(data);
      await this.authHistoryService.create(createMember.id, { ip, country, action: action.REQUEST, detail: '로그인 시도' });
      const accessToken = this.jwtService.sign(createMember);
      await this.redisService.createAccessToken(createMember.id, accessToken);
      await this.authHistoryService.create(createMember.id, { ip, country, action: action.SUCCESS, detail: '로그인 성공' });
      return accessToken;
    }

    //로그인
    await this.authHistoryService.create(member.id, { ip, country, action: action.REQUEST, detail: '로그인 시도' });
    await this.verify(member, ipAndCountry);
    const accessToken = this.jwtService.sign(member);
    await this.redisService.createAccessToken(member.id, accessToken);
    await this.authHistoryService.create(member.id, { ip, country, action: action.SUCCESS, detail: '로그인 성공' });
    return accessToken;
  }

  async logout(memberId: string, accessToken: string, ipAndCountry: IIpAndCountry): Promise<string> {
    const { ip, country } = ipAndCountry;
    await this.redisService.deleteAccessToken(memberId, accessToken);
    await this.authHistoryService.create(memberId, { ip, country, action: action.LOGOUT, detail: '로그아웃 성공' });
    return '로그아웃이 완료되었습니다.';
  }

  async verify(member: Member, ipAndCountry: IIpAndCountry): Promise<void> {
    const { ip, country } = ipAndCountry;
    //블랙리스트 검증
    if (member.blackList) {
      await this.authHistoryService.create(member.id, { ip, country, action: action.FAIL, detail: '영구 정지' });
      throw new ForbiddenException('접속이 제한된 계정입니다.');
    }

    //밴 여부 검증
    const bannedMember = await this.bannedMemberService.isValidBannedMember(member.id);
    if (bannedMember) {
      throw new ForbiddenException('접속이 제한된 계정입니다.');
    }

    //해외로그인 차단 검증
    if (!member.globalAccess && country !== 'KR') {
      await this.authHistoryService.create(member.id, { ip, country, action: action.FAIL, detail: '해외 로그인 시도' });
      throw new ForbiddenException('해외 로그인이 차단된 계정입니다.');
    }
  }

  async historyFindManyAndCount(id: string, query: IPaginationAuthHistory) {
    await this.memberService.findUniqueOrThrow(id);
    return await this.authHistoryService.findManyAndMetadata(id, query);
  }
}
