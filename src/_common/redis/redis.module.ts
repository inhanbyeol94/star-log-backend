import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisRepository } from './redis.repository';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { isGlobal: true, store: redisStore, ttl: 0, url: configService.get<string>('REDIS_URL'), password: configService.get<string>('REDIS_PASSWORD') };
      },
    }),
  ],
  providers: [RedisService, RedisRepository],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
