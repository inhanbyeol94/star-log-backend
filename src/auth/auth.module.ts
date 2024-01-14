import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { JwtModule } from '../_common/jwt/jwt.module';
import { RedisModule } from '../_common/redis/redis.module';

@Module({
  imports: [MemberModule, JwtModule, RedisModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
