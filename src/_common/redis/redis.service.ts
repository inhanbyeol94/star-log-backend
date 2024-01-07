import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type AccessToken = {
  userId: string;
  accessToken: string;
};

const ACCESS_TOKENS_KEY = 'accessTokens';
const TOKEN_EXPIRY_SECONDS = 18000; // 5시간

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * **토큰 추가**
   * @param {number} userId 사용자 ID
   * @param {string} accessToken 액세스 토큰
   */
  async addUserAccessToken(userId: string, accessToken: string): Promise<void> {
    const currentTokens: AccessToken[] = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];

    // 중복 유저 삭제
    const existingTokenIndex = currentTokens.findIndex((token) => token.userId === userId);
    const isTokenReplaced = existingTokenIndex !== -1;

    if (isTokenReplaced) {
      currentTokens.splice(existingTokenIndex, 1);
    }

    // 새 토큰 추가
    currentTokens.push({ userId, accessToken });
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
   * @param {number} userId 사용자 ID
   * @return 유저 액세스 토큰
   */
  async getUserAccessToken(userId: string): Promise<string | null> {
    const allTokens = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];
    const userToken = allTokens.find((token) => token.userId === userId);

    return userToken ? userToken.accessToken : null;
  }

  /**
   * **유저 액세스 토큰 삭제**
   * @param {number} userId 사용자 ID
   * @return Promise<void>
   */
  async deleteUserAccessToken(userId: string): Promise<void> {
    const currentTokens: AccessToken[] = (await this.cacheManager.get<AccessToken[]>(ACCESS_TOKENS_KEY)) || [];

    const updatedTokens = currentTokens.filter((token) => token.userId !== userId);

    await this.cacheManager.set(ACCESS_TOKENS_KEY, updatedTokens, TOKEN_EXPIRY_SECONDS);
  }
}
