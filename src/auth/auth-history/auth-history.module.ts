import { Module } from '@nestjs/common';
import { AuthHistoryService } from './auth-history.service';
import { AuthHistoryRepository } from './auth-history.repository';

@Module({
  providers: [AuthHistoryService, AuthHistoryRepository],
  exports: [AuthHistoryService],
})
export class AuthHistoryModule {}
