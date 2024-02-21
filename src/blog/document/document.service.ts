import { ForbiddenException, Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { IDocumentCreate } from './types/create/request.interface';
import { Document } from '@Prisma/client';
import { IDocumentUpdate } from './types/update/request.interface';
import { IDocumentFindManyAndMetaData } from './types/find-many-and-meta-data/request.interface';

@Injectable()
export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  /* 문서 생성 */
  async create(data: IDocumentCreate, blogId: number): Promise<Document> {
    return await this.documentRepository.create(data, blogId);
  }

  /* 문서 수정 */
  async update(id: number, data: IDocumentUpdate): Promise<Document> {
    await this.documentRepository.findUniqueOrThrow(id);
    // console.log(id);
    console.log('data', data);
    return await this.documentRepository.update(id, data);
  }

  /* 문서 삭제 */
  async softDelete(id: number): Promise<void> {
    await this.documentRepository.findUniqueOrThrow(id);
    return await this.documentRepository.softDelete(id);
  }

  /* 문서 조회 */
  async findManyAndMetaData(data: IDocumentFindManyAndMetaData) {
    return await this.documentRepository.findManyAndMetaData(data);
  }

  async findUnique(id: number): Promise<Document> {
    return await this.documentRepository.findUniqueOrThrow(id);
  }
}
