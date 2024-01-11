import { Body, Controller, Delete, Param, Patch, Post, Get } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { IMessage } from './blog.interface';
import { Blog } from '@prisma/client';

/**
 * Blog 관련 요청을 처리하는 Controller Class
 */
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /* 블로그 생성 */
  @Post()
  async create(@Body() data: CreateBlogDto): Promise<IMessage> {
    return await this.blogService.create(data);
  }

  /* 블로그 수정 */
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateBlogDto): Promise<IMessage> {
    return await this.blogService.update(id, data);
  }

  /* 블로그 전체조회 */
  @Get()
  async findMany(): Promise<Blog[]> {
    return await this.blogService.findMany();
  }

  /* 블로그 ID별 조회 */
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Blog> {
    return await this.blogService.findOneById(id);
  }

  /* 블로그 주소별 조회 */
  @Get('/address/:address')
  async findByAddress(@Param('address') address: string): Promise<Blog> {
    return await this.blogService.findByAddress(address);
  }

  /* 블로그 삭제 */
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<IMessage> {
    return await this.blogService.delete(id);
  }
}
