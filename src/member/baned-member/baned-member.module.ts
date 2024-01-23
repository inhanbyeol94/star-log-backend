import { Module } from '@nestjs/common';
import { BanedMemberService } from './baned-member.service';
import { BanedMemberRepository } from './baned-member.repository';
import { RedisModule } from '../../_common/redis/redis.module';

@Module({
  providers: [BanedMemberService, BanedMemberRepository, RedisModule],
  exports: [BanedMemberService],
})
export class BanedMemberModule {}
