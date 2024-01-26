import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog, Tag } from '@prisma/client';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/types/payload.interface';
import { UserAuthGuard } from '../_common/_utils/guards/user.auth.guard';
import { TagCreateDto, TagCreateParamDto } from './tag/types/create/request.dto';
import { TagUpdateDto, TagUpdateParamDto } from './tag/types/update/request.dto';
import { BlogCreateDto } from './types/create/request.dto';
import { BlogUpdateDto, BlogUpdateParamDto } from './types/update/request.dto';
import { BlogFindManyAndMetaDataDto } from './types/find-many-and-meta-data/request.dto';
import { BlogFindFirstByAddressParamDto } from './types/find-first-by-address/request.dto';
import { BlogFindUniqueParamDto } from './types/find-unique/request.dto';
import { BlogDeleteParamDto } from './types/delete/request.dto';
import { TagDeleteParamDto } from './tag/types/delete/request.dto';
import { TagFindManyByIdParamDto } from './tag/types/tag-find-many-by-id/request.dto';
import { TagFindUniqueParamDto } from './tag/types/tag-find-unique/request.dto';

/**
 * Blog 관련 요청을 처리하는 Controller Class
 */
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /* 블로그 생성 */
  @Post()
  @UseGuards(UserAuthGuard)
  async create(@Member() member: IPayload, @Body() body: BlogCreateDto): Promise<string> {
    return await this.blogService.create(member.id, body);
  }

  /* 블로그 수정 */
  @Patch(':id')
  @UseGuards(UserAuthGuard)
  async update(@Member() member: IPayload, @Param() param: BlogUpdateParamDto, @Body() body: BlogUpdateDto): Promise<string> {
    return await this.blogService.update(param.id, member.id, body);
  }

  /* 블로그 전체조회 */
  @Get()
  async findManyAndMetaData(@Query() query: BlogFindManyAndMetaDataDto) {
    return await this.blogService.findManyAndMetaData(query);
  }

  /* 블로그 ID별 조회 */
  @Get(':id')
  async findUnique(@Param() param: BlogFindUniqueParamDto): Promise<Blog> {
    return await this.blogService.findUnique(param.id);
  }

  /* 블로그 주소별 조회 */
  @Get('/address/:address')
  async findFirstByAddress(@Param() param: BlogFindFirstByAddressParamDto): Promise<Blog | null> {
    return await this.blogService.findFirstByAddress(param.address);
  }

  /* 블로그 삭제 */
  @Delete(':id')
  @UseGuards(UserAuthGuard)
  async delete(@Member() member: IPayload, @Param() param: BlogDeleteParamDto): Promise<string> {
    return await this.blogService.softDelete(param.id, member.id);
  }

  @Post(':id/tags')
  @UseGuards(UserAuthGuard)
  async tagCreate(@Member() member: IPayload, @Body() body: TagCreateDto, @Param() param: TagCreateParamDto): Promise<string> {
    return await this.blogService.tagCreate(param.id, member.id, body);
  }

  @Put(':id/tags/:tagId')
  @UseGuards(UserAuthGuard)
  async tagUpdate(@Member() member: IPayload, @Body() body: TagUpdateDto, @Param() param: TagUpdateParamDto): Promise<string> {
    return await this.blogService.tagUpdate(param.id, member.id, param.tagId, body);
  }

  @Delete(':id/tags/:tagId')
  @UseGuards(UserAuthGuard)
  async tagSoftDelete(@Member() member: IPayload, @Param() param: TagDeleteParamDto): Promise<string> {
    return await this.blogService.tagSoftDelete(param.id, member.id, param.tagId);
  }

  @Get(':id/tags')
  async tagFindManyById(@Param() param: TagFindManyByIdParamDto): Promise<Tag[]> {
    return await this.blogService.tagFindManyById(param.id);
  }

  @Get(':id/tags/:tagId')
  async tagFindUnique(@Param() param: TagFindUniqueParamDto): Promise<Tag> {
    return await this.blogService.tagFindUnique(param.id, param.tagId);
  }
}
