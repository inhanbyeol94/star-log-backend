import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../_common/prisma/prisma.service';
import { IDocumentCreate } from './types/create/request.interface';
import { Document } from '@Prisma/client';
import { IDocumentUpdate } from './types/update/request.interface';
import { IDocumentFindManyAndMetaData } from './types/find-many-and-meta-data/request.interface';
import { Prisma } from '@prisma/client';
import { findManyMetadata } from '../../_common/_utils/functions/metadata.function';

@Injectable()
export class DocumentRepository {
  constructor(private prisma: PrismaService) {}

  private documentRepository = this.prisma.extendedClient.document;

  /* 문서 생성 */
  async create({ tagId, ...data }: IDocumentCreate, blogId: number): Promise<Document> {
    return this.documentRepository.create({ data: { ...data, blogId, tags: { connect: { id: tagId } } } });
  }

  /* 문서 수정 */
  async update(id: number, { tagId, ...data }: IDocumentUpdate): Promise<Document> {
    return this.documentRepository.update({ where: { id }, data: { ...data, tags: { connect: { id: tagId } } } });
  }

  /* 문서 삭제 */
  async softDelete(id: number): Promise<void> {
    await this.documentRepository.softDelete({ id });
  }

  /* 문서 목록조회 */
  async findManyAndMetaData(data: IDocumentFindManyAndMetaData) {
    const options: Prisma.DocumentFindManyArgs = {};

    if (data.searchBy && data.searchKeyword) {
      switch (data.searchBy) {
        case 'title':
          options.where = { title: { contains: data.searchKeyword } };
          break;
        case 'tags':
          options.where = { tags: { some: { name: data.searchKeyword } } };
          break;
        case 'content':
          options.where = { content: { contains: data.searchKeyword } };
          break;
      }
    }
    const [documents, count] = await this.prisma.$transaction([
      this.documentRepository.findMany({ take: data.take, skip: (data.page - 1) * data.take, orderBy: { [data.orderBy]: data.sortOrder } }),
      this.documentRepository.count({ where: options.where }),
    ]);
    return [documents, findManyMetadata(count, data)];
  }

  /* 문서아이디 유효성검증 */
  async findUniqueOrThrow(id: number): Promise<Document> {
    const document = await this.documentRepository.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('존재하지 않는 문서입니다.');
    return document;
  }
}
