import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Blog, Prisma } from '@prisma/client';

/**
 * Blog 관련 요청을 처리하는 Repository Class
 */
@Injectable()
export class BlogRepository {
  constructor(private prisma: PrismaService) {}
  private blogRepository = this.prisma.extendedClient.blog;

  /* 블로그 생성 */
  async create(data: Prisma.BlogCreateInput): Promise<Blog> {
    return this.blogRepository.create({ data });
  }

  /* 블로그 수정 */
  async update(id: number, data: Prisma.BlogUpdateInput): Promise<Blog> {
    return this.blogRepository.update({ where: { id }, data });
  }

  /* 블로그 전체조회 */
  async findMany(): Promise<Blog[]> {
    return this.blogRepository.findMany();
  }

  /* 블로그 삭제 */
  async softDelete(id: number): Promise<Blog> {
    return this.blogRepository.softDelete({ id });
  }

  async findManyAndCount(options: Prisma.BlogFindManyArgs) {
    return this.prisma.$transaction([this.blogRepository.findMany(options), this.blogRepository.count({ where: options.where })]);
  }

  /* 블로그 주소찾기 */
  async findFirstByAddress(address: string): Promise<Blog | null> {
    return this.blogRepository.findFirst({ where: { address }, include: { member: true, tags: true } });
  }

  /* 블로그 ID 찾기 */
  async findUnique(id: number): Promise<Blog | null> {
    return this.blogRepository.findFirst({ where: { id } });
  }
}
