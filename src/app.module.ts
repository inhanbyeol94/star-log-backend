import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { JwtModule } from './_common/jwt/jwt.module';
import { BcryptModule } from './_common/bcrypt/bcrypt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './_common/prisma/prisma.module';
import { RedisModule } from './_common/redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { isGlobal: true, store: redisStore, url: configService.get<string>('REDIS_URL'), password: configService.get<string>('REDIS_PASSWORD') };
      },
    }),
    MemberModule,
    JwtModule,
    BcryptModule,
    PrismaModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
