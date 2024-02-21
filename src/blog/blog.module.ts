import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MemberModule } from '../member/member.module';
import { BlogRepository } from './blog.repository';
import { PrismaModule } from '../_common/prisma/prisma.module';
import { TagModule } from './tag/tag.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [MemberModule, PrismaModule, TagModule, DocumentModule],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
