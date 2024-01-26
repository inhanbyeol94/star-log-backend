import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { Tag } from '@prisma/client';
import { ITagCreate } from './types/create/request.interface';
import { ITagUpdate } from './types/update/request.interface';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  private tagRepository = this.prisma.extendedClient.tag;

  async create(data: ITagCreate, blogId: number): Promise<Tag> {
    return this.tagRepository.create({ data: { ...data, blogId } });
  }

  async update(id: number, data: ITagUpdate): Promise<Tag> {
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

  async findManyByBlogId(blogId: number): Promise<Tag[]> {
    return this.tagRepository.findMany({ where: { blogId } });
  }
}
