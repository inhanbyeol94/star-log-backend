import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationService } from '../../_common/pagination/pagination.service';
import { IAuthHistoryFindManyAndMetadata } from './dtos/find-many-and-metadata/request.interface';

@Injectable()
export class AuthHistoryRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private authHistoryRepository = this.prisma.extendedClient.authHistory;

  async create(data: Prisma.AuthHistoryCreateInput) {
    return this.authHistoryRepository.create({ data });
  }

  async createMany(data: Prisma.AuthHistoryCreateManyInput[]) {
    return this.authHistoryRepository.createMany({ data });
  }

  async findManyAndMetadata(memberId: string, data: IAuthHistoryFindManyAndMetadata) {
    //select은 options 변수가 아닌 메소드에 직접 설정하세요.
    const options: Prisma.AuthHistoryFindManyArgs = { where: { ...(memberId && {}) }, take: data.take, skip: (data.page - 1) * data.take };
    const [result, allCount] = await this.prisma.$transaction([this.authHistoryRepository.findMany(options), this.authHistoryRepository.count({ where: options.where })]);
    return [result, this.paginationService.metaData(allCount, data)];
  }
}
