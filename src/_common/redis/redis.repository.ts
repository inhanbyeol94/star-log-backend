import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async upsert(key: string, value: any) {
    return this.cacheManager.set(key, value, 0);
  }

  async delete(key: string) {
    return this.cacheManager.del(key);
  }

  async find<V>(key: string): Promise<V | undefined> {
    return this.cacheManager.get(key);
  }
}
