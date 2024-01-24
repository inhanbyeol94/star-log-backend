import { Injectable, OnModuleInit } from '@nestjs/common';
import { BannedMemberRepository } from './banned-member.repository';
import { RedisService } from '../../_common/redis/redis.service';

@Injectable()
export class BannedMemberService implements OnModuleInit {
  constructor(
    private bannedMemberRepository: BannedMemberRepository,
    private redisService: RedisService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBannedMembers();
  }

  async create(memberId: string, reason: string, limitedAt: Date): Promise<boolean> {
    await Promise.all([this.bannedMemberRepository.create(memberId, reason, limitedAt), this.redisService.createBannedMember(memberId, { reason, limitedAt })]);
    return true;
  }

  async softDelete(memberId: string): Promise<boolean> {
    await Promise.all([this.bannedMemberRepository.softDelete(memberId), this.redisService.deleteBannedMember(memberId)]);
    return true;
  }

  async findManyByMemberId(memberId: string) {
    return await this.bannedMemberRepository.findManyByMemberId(memberId);
  }

  async isValidBannedMember(memberId: string): Promise<boolean> {
    const bannedMember = await this.redisService.findBannedMember(memberId);
    return !!bannedMember;
  }

  async initializeBannedMembers(): Promise<void> {
    const bannedMembers = await this.bannedMemberRepository.findMany();

    await this.redisService.setBannedMember(bannedMembers);
  }
}
