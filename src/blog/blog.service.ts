import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { MemberService } from '../member/member.service';
import { Blog, Prisma, Tag } from '@prisma/client';
import { ICreateBlog, IPaginationBlog, IUpdateBlog } from './blog.interface';
import { TagService } from './tag/tag.service';

/**
 * Blog 관련 요청을 처리하는 Service Class
 */
@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogRepository,
    private memberService: MemberService,
    private tagService: TagService,
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
    const blog = await this.blogRepository.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    if (data.address) await this.isExistByAddress(data.address);
    await this.blogRepository.update(id, data);

    return '블로그 수정이 성공적으로 완료되었습니다.';
  }

  /* 블로그 아이디별 조회 */
  async findUnique(id: number): Promise<Blog> {
    return await this.blogRepository.findUniqueOrThrow(id);
  }

  /* 블로그 주소별 조회 */
  async findFirstByAddress(address: string): Promise<Blog | null> {
    await this.isValidByAddress(address);
    return await this.blogRepository.findFirstByAddress(address);
  }

  /* 블로그 삭제 */
  async softDelete(id: number, memberId: string): Promise<string> {
    await this.memberService.findUniqueOrThrow(memberId);
    const blog = await this.blogRepository.findUniqueOrThrow(id);
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
          options.where = { member: { nickname: { contains: data.searchKeyword } } };
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

  /* 블로그 주인 ID와 요청한 ID 검증 */
  async verifyAccessAuthorityOrThrow(blogMemberId: string, memberId: string): Promise<void> {
    if (blogMemberId !== memberId) throw new ForbiddenException('블로그에 대한 권한이 없습니다.');
  }

  async tagCreate(id: number, memberId: string, data: Prisma.TagUncheckedCreateInput): Promise<string> {
    const blog = await this.blogRepository.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    await this.tagService.create(data);
    return '태그가 생성되었습니다.';
  }

  async tagUpdate(id: number, memberId: string, tagId: number, data: Prisma.TagUpdateInput): Promise<string> {
    const blog = await this.blogRepository.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    await this.tagService.update(tagId, data);
    return '태그가 수정되었습니다.';
  }

  async tagSoftDelete(id: number, memberId: string, tagId: number): Promise<string> {
    const blog = await this.blogRepository.findUniqueOrThrow(id);
    await this.verifyAccessAuthorityOrThrow(blog.memberId, memberId);
    await this.tagService.softDelete(tagId);
    return '태그가 삭제되었습니다.';
  }

  async tagFindUnique(id: number, tagId: number): Promise<Tag> {
    await this.blogRepository.findUniqueOrThrow(id);
    return await this.tagService.findUnique(tagId);
  }

  async tagFindManyById(id: number): Promise<Tag[]> {
    await this.blogRepository.findUniqueOrThrow(id);
    return await this.tagService.findManyByBlogId(id);
  }
}
