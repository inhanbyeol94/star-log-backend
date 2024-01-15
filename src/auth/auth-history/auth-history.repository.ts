import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthHistoryRepository {
  constructor(private prisma: PrismaService) {}

  private authHistoryRepository = this.prisma.extendedClient.authHistory;

  async create(data: Prisma.AuthHistoryCreateInput) {
    return this.authHistoryRepository.create({ data });
  }

  async createMany(data: Prisma.AuthHistoryCreateManyInput[]) {
    return this.authHistoryRepository.createMany({ data });
  }

  async findManyAndCount(options: Prisma.AuthHistoryFindManyArgs) {
    return this.prisma.$transaction([this.authHistoryRepository.findMany(options), this.authHistoryRepository.count({ where: options.where })]);
  }
}
