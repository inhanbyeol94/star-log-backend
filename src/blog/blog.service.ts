import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { MemberService } from '../member/member.service';
import { Blog, Prisma } from '@prisma/client';

/**
 * Blog 관련 요청을 처리하는 Service Class
 */
@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogRepository,
    private memberService: MemberService,
  ) {}

  /**
   * **블로그 생성**
   * @param {CreateBlogDto} data 블로그 생성에 필요한 객체
   * @return {string} 블로그 개설이 완료되었습니다.
   */
  async create(data: CreateBlogDto): Promise<string> {
    await this.memberService.getMemberById(data.memberId);
    await this.existAddress(data.address);

    await this.blogRepository.create(data);
    return '블로그 개설이 완료되었습니다.';
  }

  /**
   * **블로그 수정**
   * @param {number} id 블로그 ID
   * @param {UpdateBlogDto} data 블로그 수정에 필요한 객체
   * @return {string} 블로그 수정이 성공적으로 완료되었습니다.
   */
  async update(id: number, data: UpdateBlogDto): Promise<string> {
    await this.memberService.getMemberById(id);
    await this.existAddress(data.address);

    const updateInfo = await this.blogRepository.update(id, data);
    if (!updateInfo) throw new BadRequestException('블로그수정에 실패하였습니다.');
    return '블로그 수정이 성공적으로 완료되었습니다.';
  }

  /**
   * **블로그 ID별 조회**
   * @param {number} id 블로그 ID
   * @return Blog
   */
  async findOneById(id: number): Promise<Blog> {
    return await this.isValidById(id);
  }

  /**
   * **블로그 주소별 조회**
   * @param {string} address 블로그 주소
   * @return Blog
   */
  async findByAddress(address: string): Promise<Blog> {
    return await this.blogRepository.findByAddress(address);
  }

  /**
   * **블로그 전체조회**
   * @return Blog
   */
  async findMany(): Promise<Blog[]> {
    return await this.blogRepository.findMany();
  }

  /**
   * **블로그 삭제**
   * @param {number} id 블로그 ID
   * @return {string} 선택하신 블로그를 삭제하였습니다.
   */
  async delete(id: number): Promise<string> {
    await this.memberService.getMemberById(id);
    await this.isValidById(id);
    await this.blogRepository.delete(id);
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

  /**
   * **블로그 주소검증**
   * @param {string} address 블로그 주소
   * @return void
   */
  async existAddress(address: string): Promise<void> {
    const blogAddress = await this.blogRepository.findByAddress(address);
    if (blogAddress) throw new ConflictException('이미 사용중인 주소입니다. 다시 한번 확인해주세요.');
  }

  /**
   * **블로그 아이디검증**
   * @param {number} id 블로그 ID
   * @return Blog
   */
  async isValidById(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException('해당하는 블로그가 존재하지 않습니다.');

    return blog;
  }
}
