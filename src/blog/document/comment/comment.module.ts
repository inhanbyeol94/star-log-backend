import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';

@Module({
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
