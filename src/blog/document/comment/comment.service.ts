import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { ICommentCreate } from './types/create/request.interface';
import { Comment } from '@prisma/client';
import { ICommentUpdate } from './types/update/request.interface';
import { ICommentFindManyAndMetaData } from './types/find-many-and-meta-data/request.interface';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async create(data: ICommentCreate, memberId: string): Promise<Comment> {
    return await this.commentRepository.create(data, memberId);
  }

  async update(id: number, data: ICommentUpdate): Promise<Comment> {
    await this.commentRepository.findUniqueOrThrow(id);
    return await this.commentRepository.update(id, data);
  }

  async softDelete(id: number): Promise<void> {
    await this.commentRepository.findUniqueOrThrow(id);
    return await this.commentRepository.softDelete(id);
  }

  async findManyAndMetaData(data: ICommentFindManyAndMetaData) {
    return await this.commentRepository.findManyAndMetaData(data);
  }

  async verifyAccessAuthorityOrThrow(commentMemberId: string, memberId: string): Promise<void> {
    if (commentMemberId !== memberId) throw new ForbiddenException('댓글에 대한 권한이 없습니다.');
  }

  async findUnique(id: number) {
    return await this.commentRepository.findUniqueOrThrow(id);
  }
}
