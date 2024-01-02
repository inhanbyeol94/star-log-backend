import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { JwtModule } from './_common/jwt/jwt.module';
import { BcryptModule } from './_common/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './_common/prisma/prisma.module';
import { RedisModule } from './_common/redis/redis.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MemberModule, JwtModule, BcryptModule, PrismaModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
