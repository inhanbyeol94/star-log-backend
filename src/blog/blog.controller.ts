import { Body, Controller, Delete, Param, Patch, Post, Get, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogAddressDto, BlogIdDto, CreateBlogDto, PaginationBlogDto, UpdateBlogDto } from './blog.dto';
import { Blog } from '@prisma/client';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';
import { PaginationDto } from '../_common/_utils/dtos/request.dto';

/**
 * Blog 관련 요청을 처리하는 Controller Class
 */
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /* 블로그 생성 */
  @Post()
  //todo 가드추가 예정
  async create(@Member() member: IPayload, @Body() body: CreateBlogDto): Promise<string> {
    return await this.blogService.create(member.id, body);
  }

  /* 블로그 수정 */
  @Patch(':id')
  //todo 가드추가 예정
  async update(@Member() member: IPayload, @Param() param: BlogIdDto, @Body() body: UpdateBlogDto): Promise<string> {
    return await this.blogService.update(param.id, member.id, body);
  }

  /* 블로그 전체조회 */
  @Get()
  //todo 가드추가 예정
  async findManyAndCount(@Query() query: PaginationBlogDto) {
    return await this.blogService.findManyAndCount(query);
  }

  /* 블로그 ID별 조회 */
  @Get(':id')
  //todo 가드추가 예정
  async findFirstById(@Param() param: BlogIdDto): Promise<Blog> {
    return await this.blogService.findUnique(param.id);
  }

  /* 블로그 주소별 조회 */
  @Get('/address/:address')
  //todo 가드추가 예정
  async findFirstByAddress(@Param() param: BlogAddressDto): Promise<Blog | null> {
    return await this.blogService.findFirstByAddress(param.address);
  }

  /* 블로그 삭제 */
  @Delete(':id')
  //todo 가드추가 예정
  async delete(@Member() member: IPayload, @Param() param: BlogIdDto): Promise<string> {
    return await this.blogService.softDelete(param.id, member.id);
  }
}
