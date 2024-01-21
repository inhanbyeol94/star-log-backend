import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisRepository } from './redis.repository';
import { logger } from '../logger/logger.service';
import { BANED_MEMBERS_KEY } from './redis.config';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(private redisRepository: RedisRepository) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBannedMembers();
  }

  async createAccessToken(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.redisRepository.find<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);
    //todo 유지은 ENV 15일 ttl 값 설정 필요 (ms)
    await this.redisRepository.upsert(memberKey, currentUserTokens, 0);
  }

  async deleteAccessToken(memberId: string, accessToken: string): Promise<void> {
    const accessTokens: string[] = ((await this.redisRepository.find<string[]>(`AT${memberId}`)) || []).filter((a) => a !== accessToken);
    //todo 유지은 ENV 15일 ttl 값 설정 필요 (ms)
    await this.redisRepository.upsert(memberId, accessTokens, 0);
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

  async isValidBannedMember(memberId: string): Promise<boolean> {
    const bannedMembers: string[] = await this.findManyBannedMember();

    return bannedMembers.includes(memberId);
  }

  async initializeBannedMembers(): Promise<void> {
    const bannedMembers = await this.findManyBannedMember();
    logger.log('Ban Completed');

    await this.redisRepository.upsert(BANED_MEMBERS_KEY, bannedMembers, 0);
  }

  async createBannedMember(memberId: string): Promise<void> {
    const bannedMembers = await this.findManyBannedMember();
    if (!bannedMembers.includes(memberId)) {
      bannedMembers.push(memberId);
      await this.redisRepository.upsert(BANED_MEMBERS_KEY, bannedMembers, 0);
    }
  }

  async deleteBannedMember(memberId: string): Promise<void> {
    let bannedMembers = await this.findManyBannedMember();
    if (bannedMembers.includes(memberId)) {
      bannedMembers = bannedMembers.filter((id) => id !== memberId);
      await this.redisRepository.upsert(BANED_MEMBERS_KEY, bannedMembers, 0);
    }
  }
}
