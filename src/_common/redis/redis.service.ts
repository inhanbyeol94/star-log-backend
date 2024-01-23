import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { logger } from '../logger/logger.service';
import { BANED_MEMBERS_KEY } from './redis.config';
import { BannedMember } from '@prisma/client';
import { IBanedMemberInfo } from '../../member/baned-member/baned-member.interface';

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

  async findManyBannedMember(): Promise<string[]> {
    const bannedMembers = await this.redisRepository.find<string[]>(BANED_MEMBERS_KEY);
    return bannedMembers || [];
  }

  async isValidBannedMember(memberId: string): Promise<any> {
    const memberKey: string = `BAN${memberId}`;
    const banedMember = (await this.redisRepository.find(memberKey)) || [];

    return banedMember;
  }

  async setBannedMember(bannedMembers: IBanedMemberInfo[]): Promise<void> {
    for (const bannedMember of bannedMembers) {
      const memberKey: string = `BAN${bannedMember.memberId}`;
      await this.redisRepository.upsert(memberKey, bannedMember, 86400000 * 15); // 15일
    }
    // console.log('isValidBannedMember: ', await this.isValidBannedMember('fa03e15f-ecb4-4b45-b47e-344ef516b41d'));
  }

  async createBannedMember(memberId: string, data: IBanedMemberInfo): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.upsert(memberKey, data, 86400000 * 15); // 15일
  }

  async deleteBannedMember(memberId: string): Promise<void> {
    const memberKey = `BAN${memberId}`;
    await this.redisRepository.delete(memberKey);

    // console.log('isValidBannedMember: ', await this.isValidBannedMember('fa03e15f-ecb4-4b45-b47e-344ef516b41d'));
  }
}
