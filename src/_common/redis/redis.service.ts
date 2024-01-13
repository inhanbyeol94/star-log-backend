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

  /**
   * **토큰 추가**
   * @param {string} memberId 사용자 ID
   * @param {string} accessToken 액세스 토큰
   */
  async setAccessToken(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);

    await this.cacheManager.set(memberKey, currentUserTokens, TOKEN_EXPIRY_SECONDS);
  }

  /**
   * **토큰 단일삭제**
   * */
  async deleteAccessToken(memberId: string, accessToken: string): Promise<void> {
    const accessTokens = (await this.redisRepository.find<string[]>(`AT${memberId}`)).filter((a) => a !== accessToken);
    await this.redisRepository.upsert(memberId, accessTokens);
  }

  /**
   * **토큰 전체삭제**
   * */
  async deleteAccessTokens(memberId: string): Promise<void> {
    await this.redisRepository.delete(memberId);
  }

  /**
   * **유저 액세스 토큰 조회**
   * @param {string} memberId 사용자 ID
   * @return 사용자의 액세스 토큰 배열
   */
  async getAccessToken(memberId: string): Promise<string[]> {
    const memberKey: string = `AT${memberId}`;
    const userTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    return userTokens;
  }

  /**
   * **벤 전체 멤버 조회**
   * @return 벤 전체 멤버 조회
   */
  async getBannedMembers(): Promise<string[]> {
    const bannedMembers = await this.cacheManager.get<string[]>(BANED_MEMBERS_KEY);
    return bannedMembers || [];
  }

  /**
   * **벤 여부 확인**
   * @param {number} memberId 사용자 ID
   * @return boolean
   */
  async isMemberBanned(memberId: string): Promise<boolean> {
    const bannedMembers = await this.getBannedMembers();

    return bannedMembers.includes(memberId);
  }

  /**
   * **REDIS 에 벤 맴버 초기화 저장**
   */
  async initializeBannedMembers(): Promise<void> {
    const bannedMembers = await this.getBannedMembers();
    logger.log('Ban Completed');

    await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
  }

  /**
   * **벤 추가**
   * @param {number} memberId 사용자 ID
   * @return boolean
   */
  async setBanedMember(memberId: string): Promise<void> {
    const bannedMembers = await this.getBannedMembers();
    if (!bannedMembers.includes(memberId)) {
      bannedMembers.push(memberId);
      await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
    }
  }

  /**
   * **벤 삭제**
   * @param {number} memberId 사용자 ID
   * @return boolean
   */
  async deleteBanedMember(memberId: string): Promise<void> {
    let bannedMembers = await this.getBannedMembers();
    if (bannedMembers.includes(memberId)) {
      bannedMembers = bannedMembers.filter((id) => id !== memberId);
      await this.cacheManager.set(BANED_MEMBERS_KEY, bannedMembers);
    }
  }
}
