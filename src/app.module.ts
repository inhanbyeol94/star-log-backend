import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { JwtModule } from './_common/jwt/jwt.module';
import { BcryptModule } from './_common/bcrypt/bcrypt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './_common/prisma/prisma.module';
import { RedisModule } from './_common/redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.register({ isGlobal: true }),

    MemberModule,
    JwtModule,
    BcryptModule,
    PrismaModule,
    RedisModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
