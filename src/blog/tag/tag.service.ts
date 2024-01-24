import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { Prisma, Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async create(data: Prisma.TagUncheckedCreateInput): Promise<Tag> {
    return await this.tagRepository.create(data);
  }

  async update(id: number, data: Prisma.TagUpdateInput): Promise<Tag> {
    await this.tagRepository.findUniqueOrThrow(id);
    return await this.tagRepository.update(id, data);
  }

  async softDelete(id: number): Promise<void> {
    await this.tagRepository.findUniqueOrThrow(id);
    return await this.tagRepository.softDelete(id);
  }

  async findUnique(id: number): Promise<Tag> {
    return await this.tagRepository.findUniqueOrThrow(id);
  }

  async findManyByBlogId(blogId: number): Promise<Tag[]> {
    return await this.tagRepository.findManyByBlogId(blogId);
  }
}
