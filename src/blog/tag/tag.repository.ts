import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  private tagRepository = this.prisma.extendedClient.tag;
}
