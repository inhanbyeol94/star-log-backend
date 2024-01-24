import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { JwtModule } from '../_common/jwt/jwt.module';
import { RedisModule } from '../_common/redis/redis.module';
import { AuthHistoryModule } from './auth-history/auth-history.module';
import { BannedMemberModule } from '../member/banned-member/banned-member.module';

@Module({
  imports: [MemberModule, JwtModule, RedisModule, AuthHistoryModule, BannedMemberModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
