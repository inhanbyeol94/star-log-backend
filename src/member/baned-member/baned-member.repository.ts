import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { BanedMember } from '@prisma/client';

@Injectable()
export class BanedMemberRepository {
  constructor(private prisma: PrismaService) {}

  private banedMemberRepository = this.prisma.extendedClient.banedMember;

  async create(memberId: string, reason: string, limitedAt: Date): Promise<void> {
    await this.banedMemberRepository.create({
      data: {
        memberId,
        reason,
        limitedAt,
      },
    });
  }

  async softDelete(memberId: number): Promise<void> {
    await this.banedMemberRepository.delete({
      where: {
        id: memberId,
      },
    });
  }

  async findManyByMemberId(memberId: string): Promise<BanedMember[]> {
    return this.banedMemberRepository.findMany({
      where: {
        memberId: memberId,
      },
    });
  }
}
