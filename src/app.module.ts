import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { JwtModule } from './_common/jwt/jwt.module';
import { BcryptModule } from './_common/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './_common/prisma/prisma.module';
import { RedisModule } from './_common/redis/redis.module';
import { LoggerModule } from './_common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { BannedMemberModule } from './member/banned-member/banned-member.module';
import { AuthHistoryModule } from './auth/auth-history/auth-history.module';
import { BlogModule } from './blog/blog.module';
import { TagModule } from './blog/tag/tag.module';
import { DocumentModule } from './blog/document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.register({ isGlobal: true }),

    MemberModule,
    BlogModule,
    JwtModule,
    BcryptModule,
    PrismaModule,
    RedisModule,
    LoggerModule,
    AuthModule,
    BannedMemberModule,
    AuthHistoryModule,
    TagModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
