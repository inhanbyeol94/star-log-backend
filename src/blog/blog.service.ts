import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { MemberService } from '../member/member.service';
import { Blog, Prisma } from '@prisma/client';
import { ICreateBlog, IPaginationBlog, IUpdateBlog } from './blog.interface';
import { IPagination } from '../_common/_utils/interfaces/request.interface';
import { PrismaService } from '../_common/prisma/prisma.service';

/**
 * Blog 관련 요청을 처리하는 Service Class
 */
@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogRepository,
    private memberService: MemberService,
  ) {}

  /* 블로그 생성 */
  async create(memberId: string, data: ICreateBlog): Promise<string> {
    await this.memberService.findUniqueOrThrow(memberId);
    await this.isExistByAddress(data.address);

    await this.blogRepository.create({ ...data, member: { connect: { id: memberId } } });
    return '블로그 개설이 완료되었습니다.';
  }

  /* 블로그 수정 */
  async update(id: number, memberId: string, data: IUpdateBlog): Promise<string> {
    await this.memberService.findUniqueOrThrow(memberId);
    const blog = await this.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    if (data.address) await this.isExistByAddress(data.address);
    await this.blogRepository.update(id, data);

    return '블로그 수정이 성공적으로 완료되었습니다.';
  }

  /* 블로그 아이디별 조회 */
  async findUnique(id: number): Promise<Blog> {
    return await this.findUniqueOrThrow(id);
  }

  /* 블로그 주소별 조회 */
  async findFirstByAddress(address: string): Promise<Blog | null> {
    await this.isValidByAddress(address);
    return await this.blogRepository.findFirstByAddress(address);
  }

  /* 블로그 삭제 */
  async softDelete(id: number, memberId: string): Promise<string> {
    await this.memberService.findUniqueOrThrow(memberId);
    const blog = await this.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    await this.blogRepository.softDelete(id);
    return '선택하신 블로그를 삭제하였습니다.';
  }

  /* 블로그목록 조회 */
  async findManyAndCount(data: IPaginationBlog): Promise<{ blogs: { id: number }[]; meta: { count: number } }> {
    const options: Prisma.BlogFindManyArgs = {
      take: data.take,
      skip: (data.page - 1) * data.take,
      orderBy: { [data.orderBy]: data.sortOrder },
    };

    if (data.searchKeyword && data.searchBy) {
      switch (data.searchBy) {
        case 'title':
          options.where = { title: { contains: data.searchKeyword } };
          break;
        case 'tags':
          options.include = { ...options.include, tags: { where: { name: data.searchKeyword } } };
          break;
        case 'nickname':
          options.where = { member: { nickname: data.searchKeyword } };
      }
    }

    const [blogs, count] = await this.blogRepository.findManyAndCount(options);
    return { blogs, meta: { count } };
  }

  /* 블로그 주소 중복검증 */
  async isExistByAddress(address: string): Promise<void> {
    const blogAddress = await this.blogRepository.findFirstByAddress(address);
    if (blogAddress) throw new ConflictException('이미 사용중인 주소입니다. 다시 한번 확인해주세요.');
  }

  /* 블로그 주소 유효성검증 */
  async isValidByAddress(address: string): Promise<void> {
    const blogAddress = await this.blogRepository.findFirstByAddress(address);
    if (!blogAddress) throw new NotFoundException('존재하지 않는 블로그 주소입니다.');
  }

  /* 블로그 아이디 유효성검증 */
  async findUniqueOrThrow(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findUnique(id);
    if (!blog) throw new NotFoundException('해당하는 블로그가 존재하지 않습니다.');

    return blog;
  }

  /* 블로그 주인 ID와 요청한 ID 검증 */
  async verifyAccessAuthorityOrThrow(blogMemberId: string, memberId: string): Promise<void> {
    if (blogMemberId !== memberId) throw new ForbiddenException('블로그에 대한 권한이 없습니다.');
  }
}
