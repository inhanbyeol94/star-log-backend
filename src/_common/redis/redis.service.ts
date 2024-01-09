import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IAccessToken } from './redis.interface';

const TOKEN_EXPIRY_SECONDS: number = 18000; // 5시간
const BANED_MEMBERS_KEY: string = 'banedMembers';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * **토큰 추가**
   * @param {string} memberId 사용자 ID
   * @param {string} accessToken 액세스 토큰
   */
  async addUserAccessToken(memberId: string, accessToken: string): Promise<void> {
    const memberKey: string = `AT${memberId}`;
    const currentUserTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    currentUserTokens.push(accessToken);

    await this.cacheManager.set(memberKey, currentUserTokens, TOKEN_EXPIRY_SECONDS);
  }

  /**
   * **유저 액세스 토큰 조회**
   * @param {string} memberId 사용자 ID
   * @return 사용자의 액세스 토큰 배열
   */
  async getUserAccessToken(memberId: string): Promise<string[]> {
    const memberKey: string = `AT${memberId}`;
    const userTokens: string[] = (await this.cacheManager.get<string[]>(memberKey)) || [];
    return userTokens;
  }

  // TODO :: 밴 해야함
  /**
   * **벤 전체 멤버 조회**
   * @return string[] 벤 전체 멤버 조회
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
