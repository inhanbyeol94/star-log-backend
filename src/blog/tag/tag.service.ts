import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { Tag } from '@prisma/client';
import { ITagCreate } from './types/create/request.interface';
import { ITagUpdate } from './types/update/request.interface';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async create(data: ITagCreate, blogId: number): Promise<Tag> {
    return await this.tagRepository.create(data, blogId);
  }

  async update(id: number, data: ITagUpdate): Promise<Tag> {
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
