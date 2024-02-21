import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../_common/prisma/prisma.service';
import { ICommentCreate } from './types/create/request.interface';
import { Comment, Prisma } from '@prisma/client';
import { ICommentUpdate } from './types/update/request.interface';
import { ICommentFindManyAndMetaData } from './types/find-many-and-meta-data/request.interface';
import { findManyMetadata } from '../../../_common/_utils/functions/metadata.function';

@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}
  private commentRepository = this.prisma.extendedClient.comment;

  async create({ documentId, ...data }: ICommentCreate, memberId: string): Promise<Comment> {
    return this.commentRepository.create({ data: { ...data, memberId, documentId } });
  }

  async update(id: number, { documentId, ...data }: ICommentUpdate): Promise<Comment> {
    return this.commentRepository.update({ where: { id }, data: { ...data, documentId } });
  }

  async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete({ id });
  }

  async findManyAndMetaData(data: ICommentFindManyAndMetaData) {
    const options: Prisma.CommentFindManyArgs = {};

    if (data.searchBy && data.searchKeyword) {
      switch (data.searchBy) {
        case 'content':
          options.where = { content: { contains: data.searchKeyword } };
          break;
        case 'nickname':
          options.where = { member: { nickname: { contains: data.searchKeyword } } };
          break;
      }
    }
    const [comments, count] = await this.prisma.$transaction([
      this.commentRepository.findMany({ take: data.take, skip: (data.page - 1) * data.take, orderBy: { [data.orderBy]: data.sortOrder } }),
      this.commentRepository.count({ where: options.where }),
    ]);
    return [comments, findManyMetadata(count, data)];
  }
  async findUniqueOrThrow(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');
    return comment;
  }
}
