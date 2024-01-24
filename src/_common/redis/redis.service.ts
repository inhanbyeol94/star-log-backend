import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { BannedMember } from '@prisma/client';
import { IBannedMemberInfo } from '../../member/banned-member/interfaces/create/banned-member.interface';

@Injectable()
export class RedisService {
  constructor(private redisRepository: RedisRepository) {}

  async accessTokenCreate(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.redisRepository.find<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);

    await this.redisRepository.upsert(memberKey, currentUserTokens, 86400000 * 15); // 15일
  }

  async accessTokenDelete(memberId: string, accessToken: string): Promise<void> {
    const accessTokens: string[] = ((await this.redisRepository.find<string[]>(`AT${memberId}`)) || []).filter((a) => a !== accessToken);
    await this.redisRepository.upsert(memberId, accessTokens, 86400000 * 15); // 15일
  }

  async accessTokenDeleteMany(memberId: string): Promise<void> {
    await this.redisRepository.delete(memberId);
  }

  async accessTokenFindMany(memberId: string): Promise<string[]> {
    const memberKey: string = `AT${memberId}`;
    const userTokens: string[] = (await this.redisRepository.find<string[]>(memberKey)) || [];
    return userTokens;
  }

  async bannedMemberFindMany(memberId: string): Promise<any> {
    const memberKey: string = `BAN${memberId}`;
    const bannedMember = (await this.redisRepository.find(memberKey)) || [];

    return bannedMember;
  }

  async bannedMemberInitial(bannedMembers: BannedMember[]): Promise<void> {
    for (const bannedMember of bannedMembers) {
      const memberKey: string = `BAN${bannedMember.memberId}`;
      await this.redisRepository.upsert(memberKey, bannedMember, 0);
    }
  }

  async bannedMemberCreate(memberId: string, data: IBannedMemberInfo): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.upsert(memberKey, data, 0);
  }

  async bannedMemberDelete(memberId: string): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.delete(memberKey);
  }
}
