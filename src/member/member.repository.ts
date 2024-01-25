import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Member, Prisma } from '@prisma/client';

@Injectable()
export class MemberRepository {
  constructor(private prisma: PrismaService) {}

  private memberRepository = this.prisma.extendedClient.member;

  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return this.memberRepository.create({ data });
  }

  async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
    return this.memberRepository.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await this.memberRepository.softDelete({ id });
  }

  async findFirstBySocialId(socialId: string): Promise<Member | null> {
    return this.memberRepository.findFirst({ where: { socialId } });
  }

  async findFirstByNickname(nickname: string): Promise<Member | null> {
    return this.memberRepository.findFirst({ where: { nickname } });
  }
  async findUniqueOrThrow(id: string): Promise<Member> {
    const member = await this.memberRepository.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('존재하지 않는 멤버입니다.');
    return member;
  }
}
