import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { MemberService } from '../member/member.service';
import { Blog, Prisma } from '@prisma/client';
import { ICreateBlog, IUpdateBlog } from './blog.interface';
import { BlogIdDto } from './blog.dto';

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
    await this.findUniqueOrThrow(id);
    // todo 본인 블로그 ID가 맞는지의 대한 검증
    if (data.address) await this.isExistByAddress(data.address);
    await this.blogRepository.update(id, data);

    return '블로그 수정이 성공적으로 완료되었습니다.';
  }

  /* 블로그 아이디별 조회 */
  async findUnique(id: number): Promise<Blog> {
    return await this.findUniqueOrThrow(id);
  }

  /* 블로그 주소별 조회 */
  async findFirstByAddress(address: string): Promise<Blog> {
    //todo 없을 경우 throw 처리될 수 있도록 설계 필요
    return await this.blogRepository.findFirstByAddress(address);
  }

  /* 블로그 전체조회 */
  async findMany(): Promise<Blog[]> {
    return await this.blogRepository.findMany();
  }

  /* 블로그 삭제 */
  async softDelete(id: number, memberId: string): Promise<string> {
    await this.memberService.findUniqueOrThrow(memberId);
    await this.findUniqueOrThrow(id);
    await this.blogRepository.softDelete(id);
    return '선택하신 블로그를 삭제하였습니다.';
  }

  /**
   * **Find Many**
   * @remarks Pagination
   * */
  async findManyAndCount(data: any) {
    const options: Prisma.BlogFindManyArgs = { take: data.take, skip: (data.page - 1) * data.take };
    data.title && (options.where = { title: data.title });
    data.address && (options.where = { ...options.where, address: data.address });

    const [blogs, count] = await this.blogRepository.findManyAndCount(options);
    return { blogs, meta: { count } };
  }

  /* 블로그 주소 중복검증 */
  async isExistByAddress(address: string): Promise<void> {
    const blogAddress = await this.blogRepository.findFirstByAddress(address);
    if (blogAddress) throw new ConflictException('이미 사용중인 주소입니다. 다시 한번 확인해주세요.');
  }

  /* 블로그 아이디 유효성검증 */
  async findUniqueOrThrow(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findUnique(id);
    if (!blog) throw new NotFoundException('해당하는 블로그가 존재하지 않습니다.');

    return blog;
  }
}
