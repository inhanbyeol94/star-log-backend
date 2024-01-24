import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { IBannedMemberInfo } from '../../member/banned-member/banned-member.interface';
import { BannedMember } from '@prisma/client';

@Injectable()
export class RedisService {
  constructor(private redisRepository: RedisRepository) {}

  async createAccessToken(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.redisRepository.find<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);

    await this.redisRepository.upsert(memberKey, currentUserTokens, 86400000 * 15); // 15일
  }

  async deleteAccessToken(memberId: string, accessToken: string): Promise<void> {
    const accessTokens: string[] = ((await this.redisRepository.find<string[]>(`AT${memberId}`)) || []).filter((a) => a !== accessToken);
    await this.redisRepository.upsert(memberId, accessTokens, 86400000 * 15); // 15일
  }

  async deleteManyAccessToken(memberId: string): Promise<void> {
    await this.redisRepository.delete(memberId);
  }

  async findFirstByAccessToken(memberId: string): Promise<string[]> {
    const memberKey: string = `AT${memberId}`;
    const userTokens: string[] = (await this.redisRepository.find<string[]>(memberKey)) || [];
    return userTokens;
  }

  async findBannedMember(memberId: string): Promise<any> {
    const memberKey: string = `BAN${memberId}`;
    const bannedMember = (await this.redisRepository.find(memberKey)) || [];

    return bannedMember;
  }

  async setBannedMember(bannedMembers: BannedMember[]): Promise<void> {
    for (const bannedMember of bannedMembers) {
      const memberKey: string = `BAN${bannedMember.memberId}`;
      await this.redisRepository.upsert(memberKey, bannedMember, 0);
    }

    // console.log('isValidBannedMember: ', await this.isValidBannedMember('fa03e15f-ecb4-4b45-b47e-344ef516b41d'));
  }

  async createBannedMember(memberId: string, data: IBannedMemberInfo): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.upsert(memberKey, data, 0);
  }

  async deleteBannedMember(memberId: string): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.delete(memberKey);

    // console.log('isValidBannedMember: ', await this.isValidBannedMember('fa03e15f-ecb4-4b45-b47e-344ef516b41d'));
  }
}
