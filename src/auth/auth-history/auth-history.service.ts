import { Injectable } from '@nestjs/common';
import { AuthHistoryRepository } from './auth-history.repository';

@Injectable()
export class AuthHistoryService {
  constructor(private authHistoryRepository: AuthHistoryRepository) {}
}
