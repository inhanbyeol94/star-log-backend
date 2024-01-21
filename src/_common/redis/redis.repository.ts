import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async upsert(key: string, value: any, ttl: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string) {
    return this.cacheManager.del(key);
  }

  async find<V>(key: string): Promise<V | undefined> {
    return this.cacheManager.get(key);
  }
}
