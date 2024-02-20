import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';

@Module({
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
})
export class DocumentModule {}
