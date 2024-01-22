import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { Prisma, Tag } from '@prisma/client';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  private tagRepository = this.prisma.extendedClient.tag;

  async create(data: Prisma.TagUncheckedCreateInput): Promise<Tag> {
    return this.tagRepository.create({ data });
  }

  async update(id: number, data: Prisma.TagUpdateInput): Promise<Tag> {
    return this.tagRepository.update({ where: { id }, data });
  }

  async softDelete(id: number): Promise<void> {
    await this.tagRepository.softDelete({ id });
  }

  async findUniqueOrThrow(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('존재하지 않는 리소스입니다.');
    return tag;
  }
}
