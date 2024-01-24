import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { RedisModule } from '../_common/redis/redis.module';
import { MemberRepository } from './member.repository';
import { BannedMemberModule } from './banned-member/banned-member.module';

@Module({
  imports: [RedisModule, BannedMemberModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
