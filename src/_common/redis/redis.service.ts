import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type AccessToken = {
  memberId: string;
  accessToken: string;
};

const ACCESS_TOKENS_KEY = 'accessTokens';
const TOKEN_EXPIRY_SECONDS = 18000; // 5시간

const BANED_MEMBERS_KEY = 'banedMembers';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * **토큰 추가**
   * @param {number} memberId 사용자 ID
   * @param {string} accessToken 액세스 토큰
   */
  async addUserAccessToken(memberId: string, accessToken: string): Promise<void> {
    const currentTokens: AccessToken[] = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];

    // 중복 유저 삭제
    const existingTokenIndex = currentTokens.findIndex((token) => token.memberId === memberId);
    const isTokenReplaced = existingTokenIndex !== -1;

    if (isTokenReplaced) {
      currentTokens.splice(existingTokenIndex, 1);
    }

    // 새 토큰 추가
    currentTokens.push({ memberId, accessToken });
    await this.cacheManager.set(ACCESS_TOKENS_KEY, currentTokens, TOKEN_EXPIRY_SECONDS);
  }

  /**
   * **모든 액세스 토큰 조회**
   * @return 모든 액세스 토큰 배열
   */
  async getAllUserAccessTokens(): Promise<AccessToken[]> {
    return (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];
  }

  /**
   * **유저 액세스 토큰 조회**
   * @param {number} memberId 사용자 ID
   * @return 유저 액세스 토큰
   */
  async getUserAccessToken(memberId: string): Promise<string | null> {
    const allTokens = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];
    const userToken = allTokens.find((token) => token.memberId === memberId);

    return userToken ? userToken.accessToken : null;
  }

  /**
   * **유저 액세스 토큰 삭제**
   * @param {number} memberId 사용자 ID
   * @return Promise<void>
   */
  async deleteUserAccessToken(memberId: string): Promise<void> {
    const currentTokens: AccessToken[] = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];

    const updatedTokens = currentTokens.filter((token) => token.memberId !== memberId);

    await this.cacheManager.set(ACCESS_TOKENS_KEY, updatedTokens, TOKEN_EXPIRY_SECONDS);
  }

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
