import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Blog, Prisma } from '@prisma/client';
import { IBlogFindManyAndMetaData } from './types/find-many-and-meta-data/request.interface';
import { IBlogCreate } from './types/create/request.interface';
import { IBlogUpdate } from './types/update/request.interface';
import { findManyMetadata } from '../_common/_utils/functions/metadata.function';

/**
 * Blog 관련 요청을 처리하는 Repository Class
 */
@Injectable()
export class BlogRepository {
  constructor(private prisma: PrismaService) {}
  private blogRepository = this.prisma.extendedClient.blog;

  /* 블로그 생성 */
  async create(data: IBlogCreate, memberId: string): Promise<Blog> {
    return this.blogRepository.create({ data: { ...data, memberId } });
  }

  /* 블로그 수정 */
  async update(id: number, data: IBlogUpdate): Promise<Blog> {
    return this.blogRepository.update({ where: { id }, data });
  }

  /* 블로그 삭제 */
  async softDelete(id: number): Promise<Blog> {
    return this.blogRepository.softDelete({ id });
  }

  /* 블로그 목록조회 */
  async findManyAndMetaData(data: IBlogFindManyAndMetaData) {
    const options: Prisma.BlogFindManyArgs = {};

    if (data.searchKeyword && data.searchBy) {
      switch (data.searchBy) {
        case 'title':
          options.where = { title: { contains: data.searchKeyword } };
          break;
        case 'tags':
          options.where = { tags: { some: { name: data.searchKeyword } } };
          break;
        case 'nickname':
          options.where = { member: { nickname: { contains: data.searchKeyword } } };
          break;
      }
    }
    const [blogs, count] = await this.prisma.$transaction([
      this.blogRepository.findMany({ take: data.take, skip: (data.page - 1) * data.take, orderBy: { [data.orderBy]: data.sortOrder } }),
      this.blogRepository.count({ where: options.where }),
    ]);
    return [blogs, findManyMetadata(count, data)];
  }

  /* 블로그 주소찾기 */
  async findFirstByAddress(address: string): Promise<Blog | null> {
    return this.blogRepository.findFirst({ where: { address }, include: { member: true, tags: true } });
  }

  async findUniqueOrThrow(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('해당하는 블로그가 존재하지 않습니다.');
    return blog;
  }
}
