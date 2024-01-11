import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { RedisModule } from '../_common/redis/redis.module';
import { JwtModule } from '../_common/jwt/jwt.module';
import { MemberRepository } from './member.repository';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
})
export class MemberModule {}
