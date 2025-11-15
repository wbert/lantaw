import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/common/cache.service';
import { TmdbService } from './tmdb.service';

@Injectable()
export class SearchService {
  constructor(
    private cache: CacheService,
    private tmdb: TmdbService,
  ) {}
  search(q: string, page: number) {
    const key = `tmdb:search:${q}:${page}`;
    return this.cache.wrap(key, 60, () => this.tmdb.searchMulti(q, page));
  }
}
