import { Injectable } from '@nestjs/common';
import { BanedMemberRepository } from './baned-member.repository';
import { RedisService } from '../../_common/redis/redis.service';

@Injectable()
export class BanedMemberService {
  constructor(
    private banedMemberRepository: BanedMemberRepository,
    private redisService: RedisService,
  ) {}

  async create(memberId: string, reason: string, limitedAt: Date): Promise<boolean> {
    await Promise.all([this.banedMemberRepository.create(memberId, reason, limitedAt), this.redisService.createBannedMember(memberId)]);
    return true;
  }

  async softDelete(memberId: string): Promise<boolean> {
    // await Promise.all([this.banedMemberRepository.softDelete(member.id), this.redisService.deleteBanedMember(memberId)]);
    return true;
  }

  async findManyByMemberId(memberId: string) {
    return await this.banedMemberRepository.findManyByMemberId(memberId);
  }
}
