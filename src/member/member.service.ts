import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Member } from '@prisma/client';
import { RedisService } from '../_common/redis/redis.service';
import { MemberRepository } from './member.repository';
import { IMemberUpdate } from './member.interface';
import { ISocial } from '../auth/auth.interface';
import { BannedMemberService } from './banned-member/banned-member.service';

@Injectable()
export class MemberService {
  constructor(
    private redisService: RedisService,
    private memberRepository: MemberRepository,
  ) {}
  async create(data: ISocial): Promise<Member> {
    return await this.memberRepository.create({ socialId: data.id, email: data.email, nickname: data.nickname, profileImage: data.profileImage, platform: data.platform });
  }

  async update(id: string, data: IMemberUpdate): Promise<string> {
    await this.findUniqueOrThrow(id);
    if (data.nickname) await this.existNickname(id, data.nickname);
    await Promise.all([this.memberRepository.update(id, data), this.redisService.deleteManyAccessToken(id)]);
    return '정보가 수정되었습니다.\n보안 상 모든 기기에서 로그아웃되며, 재로그인이 필요합니다.';
  }

  async softDelete(id: string): Promise<string> {
    await this.findUniqueOrThrow(id);
    await Promise.all([this.memberRepository.softDelete(id), this.redisService.deleteManyAccessToken(id)]);
    return '탈퇴가 완료되었습니다.';
  }

  async findUnique(id: string): Promise<Member> {
    return await this.findUniqueOrThrow(id);
  }

  async findFirstBySocialId(socialId: string): Promise<Member | null> {
    return await this.memberRepository.findFirstBySocialId(socialId);
  }

  async existNickname(id: string, nickname: string): Promise<void> {
    const member = await this.memberRepository.findFirstByNickname(nickname);
    if (member && member.id !== id) throw new ConflictException('이미 사용중인 닉네임입니다.');
  }

  async findUniqueOrThrow(id: string): Promise<Member> {
    const member = await this.memberRepository.findUnique(id);
    if (!member) throw new NotFoundException('존재하지 않는 멤버입니다.');
    return member;
  }
}
