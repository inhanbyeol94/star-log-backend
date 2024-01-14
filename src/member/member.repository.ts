import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Prisma, Member, BanedMember } from '@prisma/client';

@Injectable()
export class MemberRepository {
  constructor(private prisma: PrismaService) {}

  private memberRepository = this.prisma.extendedClient.member;
  private banedMemberRepository = this.prisma.extendedClient.banedMember;

  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return this.memberRepository.create({ data });
  }

  async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
    return this.memberRepository.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.memberRepository.softDelete({ id });
  }

  async findFirstById(id: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { id } });
  }

  async findFirstBySocialId(socialId: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { socialId } });
  }

  async findFirstByNickname(nickname: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { nickname } });
  }

  async setBanned(memberId: string, reason: string, limitedAt: Date): Promise<void> {
    await this.prisma.banedMember.create({
      data: {
        memberId,
        reason,
        limitedAt,
      },
    });
  }

  async deleteBanned(memberId: number): Promise<void> {
    await this.prisma.banedMember.delete({
      where: {
        id: memberId,
      },
    });
  }

  async findFirstBanned(memberId: string): Promise<BanedMember> {
    return this.prisma.banedMember.findFirst({
      where: {
        memberId: memberId,
      },
    });
  }
}
