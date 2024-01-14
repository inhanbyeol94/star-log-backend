import { Injectable } from '@nestjs/common';
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

  async findUnique(id: string): Promise<Member> {
    return this.memberRepository.findUnique({ where: { id } });
  }

  async findFirstBySocialId(socialId: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { socialId } });
  }

  async findFirstByNickname(nickname: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { nickname } });
  }
}
