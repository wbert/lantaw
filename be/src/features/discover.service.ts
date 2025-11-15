import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/common/cache.service';
import { TmdbService } from './tmdb.service';

@Injectable()
export class DiscoverService {
  constructor(
    private tmdb: TmdbService,
    private cache: CacheService,
  ) {}

  list(type: 'movie' | 'tv', q: Record<string, string>) {
    const qs = new URLSearchParams(q).toString();
    const key = `tmdb:discover:${type}:${qs}`;
    return this.cache.wrap(key, 60, () => this.tmdb.discover(type, q));
  }
}
