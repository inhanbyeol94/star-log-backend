import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Blog, Prisma } from '@prisma/client';
import { IPaginationBlog } from './blog.interface';
import { PaginationService } from '../_common/pagination/pagination.service';

/**
 * Blog 관련 요청을 처리하는 Repository Class
 */
@Injectable()
export class BlogRepository {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}
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

  /* 블로그 목록조회 */
  async findManyAndCount(data: IPaginationBlog) {
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
    return [blogs, this.paginationService.metaData(count, data)];
  }

  /* 블로그 주소찾기 */
  async findFirstByAddress(address: string): Promise<Blog | null> {
    return this.blogRepository.findFirst({ where: { address }, include: { member: true, tags: true } });
  }

  /* 블로그 ID 찾기 */
  async findUnique(id: number): Promise<Blog | null> {
    return this.blogRepository.findFirst({ where: { id } });
  }

  async findUniqueOrThrow(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('해당하는 블로그가 존재하지 않습니다.');
    return blog;
  }
}
