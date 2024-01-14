import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { RedisModule } from '../_common/redis/redis.module';
import { MemberRepository } from './member.repository';
import { BanedMemberModule } from './baned-member/baned-member.module';

@Module({
  imports: [RedisModule, BanedMemberModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
