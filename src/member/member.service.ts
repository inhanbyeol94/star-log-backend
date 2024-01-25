import { ConflictException, Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { RedisService } from '../_common/redis/redis.service';
import { MemberRepository } from './member.repository';
import { ISocial } from '../auth/types/o-auth/request.interface';
import { IMemberUpdate } from './types/update/request.interface';

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
    await this.memberRepository.findUniqueOrThrow(id);
    if (data.nickname) await this.existNickname(id, data.nickname);
    await Promise.all([this.memberRepository.update(id, data), this.redisService.accessTokenDeleteMany(id)]);
    return '정보가 수정되었습니다.\n보안 상 모든 기기에서 로그아웃되며, 재로그인이 필요합니다.';
  }

  async softDelete(id: string): Promise<string> {
    await this.memberRepository.findUniqueOrThrow(id);
    await Promise.all([this.memberRepository.softDelete(id), this.redisService.accessTokenDeleteMany(id)]);
    return '탈퇴가 완료되었습니다.';
  }

  async findUnique(id: string): Promise<Member> {
    return await this.memberRepository.findUniqueOrThrow(id);
  }

  async findFirstBySocialId(socialId: string): Promise<Member | null> {
    return await this.memberRepository.findFirstBySocialId(socialId);
  }

  async existNickname(id: string, nickname: string): Promise<void> {
    const member = await this.memberRepository.findFirstByNickname(nickname);
    if (member && member.id !== id) throw new ConflictException('이미 사용중인 닉네임입니다.');
  }
}
