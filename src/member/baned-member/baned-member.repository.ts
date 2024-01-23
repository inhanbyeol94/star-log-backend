import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { BannedMember } from '@prisma/client';
import { IBanedMemberInfo } from './baned-member.interface';

@Injectable()
export class BanedMemberRepository {
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

  async softDelete(memberId: number): Promise<void> {
    await this.bannedMemberRepository.delete({
      where: {
        id: memberId,
      },
    });
  }

  async findMany(): Promise<IBanedMemberInfo[]> {
    return this.bannedMemberRepository.findMany({
      select: {
        memberId: true,
        reason: true,
        limitedAt: true,
      },
    });
  }

  async findManyByMemberId(memberId: string): Promise<BannedMember[]> {
    return this.bannedMemberRepository.findMany({
      where: {
        memberId: memberId,
      },
    });
  }
}
