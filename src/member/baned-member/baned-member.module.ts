import { Module } from '@nestjs/common';
import { BanedMemberService } from './baned-member.service';
import { BanedMemberRepository } from './baned-member.repository';

@Module({
  providers: [BanedMemberService, BanedMemberRepository],
  exports: [BanedMemberService],
})
export class BanedMemberModule {}
