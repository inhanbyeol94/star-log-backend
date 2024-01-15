import { Injectable } from '@nestjs/common';
import { AuthHistoryRepository } from './auth-history.repository';
import { Prisma } from '@prisma/client';
import { IPagination } from '../../_common/_utils/interfaces/request.interface';
import { ICreateAuthHistory, IPaginationAuthHistory } from './auth-history.interface';

@Injectable()
export class AuthHistoryService {
  constructor(private authHistoryRepository: AuthHistoryRepository) {}

  async create(memberId: string, data: ICreateAuthHistory) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.create({ ...data, member: { connect: { id: memberId } } });
    } catch (error) {
      //todo @유지은 loggerService 브리핑 후 적용예정
    }
  }

  async createMany(memberId: string, data: ICreateAuthHistory[]) {
    try {
      //로그기록 실패사유로 메인로직에 영향이 없도록 예외처리
      await this.authHistoryRepository.createMany(data.map((p) => ({ ...p, memberId })));
    } catch (error) {
      //todo @유지은 loggerService 브리핑 후 적용예정
    }
  }

  async findManyAndCount(memberId: string, data: IPaginationAuthHistory) {
    //타입별로 결과를 반환하는 필터기능이 추가됐으면해 searchType: number
    const options: Prisma.AuthHistoryFindManyArgs = { where: { memberId }, take: data.take, skip: (data.page - 1) * data.take };
    return await this.authHistoryRepository.findManyAndCount(options);
  }
}
