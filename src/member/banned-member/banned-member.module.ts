import { Module } from '@nestjs/common';
import { BannedMemberService } from './banned-member.service';
import { BannedMemberRepository } from './banned-member.repository';
import { RedisModule } from '../../_common/redis/redis.module';

@Module({
  providers: [BannedMemberService, BannedMemberRepository, RedisModule],
  exports: [BannedMemberService, RedisModule],
})
export class BannedMemberModule {}
