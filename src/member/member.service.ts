import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { logger } from '../_common/logger/logger.service';
import { RedisService } from '../_common/redis/redis.service';

const prisma = new PrismaClient();
const BANNED_MEMBERS_KEY = 'bannedMembers';

@Injectable()
export class MemberService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBannedMembers();
  }

  /**
   * **REDIS 에 벤 맴버 초기화 저장**
   */
  async initializeBannedMembers(): Promise<void> {
    const bannedMembersId = await this.redisService.getBannedMembers();
    logger.log('Ban Completed', bannedMembersId);

    await this.cacheManager.set(BANNED_MEMBERS_KEY, bannedMembersId);
  }

  /**
   * **벤 추가**
   * @param {number} memberId 사용자 ID
   * @param {string} reason 이유
   * @param {date} limitedAt limitedAt
   * @return boolean
   */
  async setBanedMember(memberId: string, reason: string, limitedAt: Date): Promise<boolean> {
    await prisma.banedMember.create({
      data: {
        memberId: memberId,
        reason: reason,
        limitedAt: limitedAt,
      },
    });
    await this.redisService.setBanedMember(memberId.toString());

    return true;
  }

  /**
   * **벤 삭제**
   * @param {number} memberId 사용자 ID
   * @return boolean
   */
  async deleteBanedMember(memberId: string): Promise<boolean> {
    const member = await this.getMemberById(memberId);
    await prisma.banedMember.delete({
      where: {
        id: member.id,
      },
    });
    await this.redisService.deleteBanedMember(memberId.toString());

    return true;
  }

  /**
   * **멤버 찾기**
   * @param {number} memberId 사용자 ID
   * @return Member
   */
  getMemberById(memberId: string) {
    return prisma.banedMember.findFirst({
      where: {
        memberId: memberId,
      },
    });
  }
}
