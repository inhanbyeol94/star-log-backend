import { Injectable } from '@nestjs/common';
import { AuthHistoryRepository } from './auth-history.repository';
import { logger } from '../../_common/logger/logger.service';
import { IAuthHistoryFindManyAndMetadata } from './types/find-many-and-metadata/request.interface';
import { IAuthHistoryCreate } from './types/create/request.interface';

@Injectable()
export class AuthHistoryService {
  constructor(private authHistoryRepository: AuthHistoryRepository) {}

  async create(memberId: string, data: IAuthHistoryCreate) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.create({ ...data, member: { connect: { id: memberId } } });
    } catch (error) {
      logger.error(error);
    }
  }

  async createMany(memberId: string, data: IAuthHistoryCreate[]) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.createMany(data.map((p) => ({ ...p, memberId })));
    } catch (error) {
      logger.error(error);
    }
  }

  async findManyAndMetadata(memberId: string, data: IAuthHistoryFindManyAndMetadata) {
    return await this.authHistoryRepository.findManyAndMetadata(memberId, data);
  }
}
