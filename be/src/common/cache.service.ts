import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private client = new Redis(process.env.REDIS_URL!);
  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const v = await this.client.get(key);
    return v ? (JSON.parse(v) as T) : null;
  }

  async setJSON(key: string, data: unknown, ttlSec = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(data), 'EX', ttlSec);
  }

  async wrap<T>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
    const cached = await this.getJSON<T>(key);
    if (cached) return cached;
    const fresh = await fn();
    await this.setJSON(key, fresh, ttlSec);
    return fresh;
  }
}
