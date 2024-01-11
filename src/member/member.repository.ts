import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Prisma, Member } from '@prisma/client';

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

  async delete(id: string): Promise<void> {
    await this.memberRepository.softDelete({ id });
  }

  async findFirstById(id: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { id } });
  }

  async findFirstByNickname(nickname: string): Promise<Member> {
    return this.memberRepository.findFirst({ where: { nickname } });
  }
}
