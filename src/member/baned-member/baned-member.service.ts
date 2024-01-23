import { Injectable, OnModuleInit } from '@nestjs/common';
import { BanedMemberRepository } from './baned-member.repository';
import { RedisService } from '../../_common/redis/redis.service';
import { logger } from '../../_common/logger/logger.service';
import { BANED_MEMBERS_KEY } from '../../_common/redis/redis.config';

@Injectable()
export class BanedMemberService implements OnModuleInit {
  constructor(
    private banedMemberRepository: BanedMemberRepository,
    private redisService: RedisService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBannedMembers();
  }

  async create(memberId: string, reason: string, limitedAt: Date): Promise<boolean> {
    await Promise.all([this.banedMemberRepository.create(memberId, reason, limitedAt), this.redisService.createBannedMember(memberId, { memberId, reason, limitedAt })]);
    return true;
  }

  async softDelete(memberId: string): Promise<boolean> {
    await Promise.all([this.banedMemberRepository.softDelete(memberId), this.redisService.deleteBannedMember(memberId)]);
    return true;
  }

  async findManyByMemberId(memberId: string) {
    return await this.banedMemberRepository.findManyByMemberId(memberId);
  }

  async initializeBannedMembers(): Promise<void> {
    const bannedMembers = await this.banedMemberRepository.findMany();

    await this.redisService.setBannedMember(bannedMembers);
  }
}
