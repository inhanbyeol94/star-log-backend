import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';

@Injectable()
export class AuthHistoryRepository {
  constructor(private prisma: PrismaService) {}

  private authHistoryRepository = this.prisma.extendedClient.authHistory;
}
