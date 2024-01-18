import { Body, Controller, Delete, Param, Patch, Post, Get, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogAddressDto, BlogIdDto, CreateBlogDto, PaginationBlogDto, UpdateBlogDto } from './blog.dto';
import { Blog } from '@prisma/client';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';
import { UserAuthGuard } from '../_common/_utils/guards/user.auth.guard';

/**
 * Blog 관련 요청을 처리하는 Controller Class
 */
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /* 블로그 생성 */
  @Post()
  @UseGuards(UserAuthGuard)
  async create(@Member() member: IPayload, @Body() body: CreateBlogDto): Promise<string> {
    return await this.blogService.create(member.id, body);
  }

  /* 블로그 수정 */
  @Patch(':id')
  @UseGuards(UserAuthGuard)
  async update(@Member() member: IPayload, @Param() param: BlogIdDto, @Body() body: UpdateBlogDto): Promise<string> {
    return await this.blogService.update(param.id, member.id, body);
  }

  /* 블로그 전체조회 */
  @Get()
  @UseGuards(UserAuthGuard)
  async findManyAndCount(@Query() query: PaginationBlogDto) {
    return await this.blogService.findManyAndCount(query);
  }

  /* 블로그 ID별 조회 */
  @Get(':id')
  @UseGuards(UserAuthGuard)
  async findFirstById(@Param() param: BlogIdDto): Promise<Blog> {
    return await this.blogService.findUnique(param.id);
  }

  /* 블로그 주소별 조회 */
  @Get('/address/:address')
  @UseGuards(UserAuthGuard)
  async findFirstByAddress(@Param() param: BlogAddressDto): Promise<Blog | null> {
    return await this.blogService.findFirstByAddress(param.address);
  }

  /* 블로그 삭제 */
  @Delete(':id')
  @UseGuards(UserAuthGuard)
  async delete(@Member() member: IPayload, @Param() param: BlogIdDto): Promise<string> {
    return await this.blogService.softDelete(param.id, member.id);
  }
}
