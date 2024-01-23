import { Injectable } from '@nestjs/common';
import { AuthHistoryRepository } from './auth-history.repository';
import { Prisma } from '@prisma/client';
import { IPagination } from '../../_common/_utils/interfaces/request.interface';
import { ICreateAuthHistory, IPaginationAuthHistory } from './auth-history.interface';
import { logger } from '../../_common/logger/logger.service';

@Injectable()
export class AuthHistoryService {
  constructor(private authHistoryRepository: AuthHistoryRepository) {}

  async create(memberId: string, data: ICreateAuthHistory) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.create({ ...data, member: { connect: { id: memberId } } });
    } catch (error) {
      logger.error(error);
    }
  }

  async createMany(memberId: string, data: ICreateAuthHistory[]) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.createMany(data.map((p) => ({ ...p, memberId })));
    } catch (error) {
      logger.error(error);
    }
  }

  async findManyAndCount(memberId: string, data: IPaginationAuthHistory) {
    return await this.authHistoryRepository.findManyAndCount(memberId, data);
  }
}
