import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisRepository } from './redis.repository';
import { logger } from '../logger/logger.service';
import { BANED_MEMBERS_KEY } from './redis.config';

const TOKEN_EXPIRY_SECONDS: number = 18000; // 5시간

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisRepository: RedisRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBannedMembers();
  }

  async createAccessToken(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);

    await this.cacheManager.set(memberKey, currentUserTokens, TOKEN_EXPIRY_SECONDS);
  }

  async deleteAccessToken(memberId: string, accessToken: string): Promise<void> {
    const accessTokens: string[] = ((await this.redisRepository.find<string[]>(`AT${memberId}`)) || []).filter((a) => a !== accessToken);
    await this.redisRepository.upsert(memberId, accessTokens);
  }

  async deleteManyAccessToken(memberId: string): Promise<void> {
    await this.redisRepository.delete(memberId);
  }

  async findFirstByAccessToken(memberId: string): Promise<string[]> {
    const memberKey: string = `AT${memberId}`;
    const userTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    return userTokens;
  }

  async findManyBannedMember(): Promise<string[]> {
    const bannedMembers = await this.cacheManager.get<string[]>(BANED_MEMBERS_KEY);
    return bannedMembers || [];
  }

  async isValidBannedMember(memberId: string): Promise<boolean> {
    const bannedMembers: string[] = await this.findManyBannedMember();

    return bannedMembers.includes(memberId);
  }

  async initializeBannedMembers(): Promise<void> {
    const bannedMembers = await this.findManyBannedMember();
    logger.log('Ban Completed');

    await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
  }

  async createBannedMember(memberId: string): Promise<void> {
    const bannedMembers = await this.findManyBannedMember();
    if (!bannedMembers.includes(memberId)) {
      bannedMembers.push(memberId);
      await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
    }
  }

  async deleteBannedMember(memberId: string): Promise<void> {
    let bannedMembers = await this.findManyBannedMember();
    if (bannedMembers.includes(memberId)) {
      bannedMembers = bannedMembers.filter((id) => id !== memberId);
      await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
    }
  }
}
