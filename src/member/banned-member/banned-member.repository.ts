import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { BannedMember } from '@prisma/client';

@Injectable()
export class BannedMemberRepository {
  constructor(private prisma: PrismaService) {}

  private bannedMemberRepository = this.prisma.extendedClient.bannedMember;

  async create(memberId: string, reason: string, limitedAt: Date): Promise<void> {
    await this.bannedMemberRepository.create({
      data: {
        memberId,
        reason,
        limitedAt,
      },
    });
  }

  async softDelete(memberId: string): Promise<void> {
    await this.bannedMemberRepository.deleteMany({
      where: {
        memberId: memberId,
      },
    });
  }

  async findMany(): Promise<BannedMember[]> {
    return this.bannedMemberRepository.findMany({});
  }

  async findManyByMemberId(memberId: string): Promise<BannedMember[]> {
    return this.bannedMemberRepository.findMany({
      where: {
        memberId: memberId,
      },
    });
  }
}
