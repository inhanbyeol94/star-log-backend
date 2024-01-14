import { Body, Controller, Delete, Param, Patch, Post, Get } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { Blog } from '@prisma/client';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';

/**
 * Blog 관련 요청을 처리하는 Controller Class
 */
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /* 블로그 생성 */
  @Post()
  //todo 가드추가 예정
  async create(@Member() member: IPayload, @Body() data: CreateBlogDto): Promise<string> {
    return await this.blogService.create(member.id, data);
  }

  /* 블로그 수정 */
  @Patch(':id')
  //todo 가드추가 예정
  async update(@Param('id') id: number, @Body() data: UpdateBlogDto): Promise<string> {
    return await this.blogService.update(id, data);
  }

  /* 블로그 전체조회 */
  @Get()
  //todo 가드추가 예정
  async findMany(): Promise<Blog[]> {
    return await this.blogService.findMany();
  }

  /* 블로그 ID별 조회 */
  @Get(':id')
  //todo 가드추가 예정
  async findOneById(@Param('id') id: number): Promise<Blog> {
    return await this.blogService.findOneById(id);
  }

  /* 블로그 주소별 조회 */
  @Get('/address/:address')
  //todo 가드추가 예정
  async findByAddress(@Param('address') address: string): Promise<Blog> {
    return await this.blogService.findByAddress(address);
  }

  /* 블로그 삭제 */
  @Delete(':id')
  //todo 가드추가 예정
  async delete(@Param('id') id: number): Promise<string> {
    return await this.blogService.delete(id);
  }
}
