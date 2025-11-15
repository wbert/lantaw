import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/common/cache.service';
import { TmdbService } from './tmdb.service';

@Injectable()
export class MediaService {
  constructor(
    private tmdb: TmdbService,
    private cache: CacheService,
  ) {}
  async bundle(type: 'movie' | 'tv', id: number) {
    const key = `tmdb:media:${type}:${id}`;
    return this.cache.wrap(key, 300, async () => {
      const [details, credits, videos, recommendations] = await Promise.all([
        this.tmdb.details(type, id),
        this.tmdb.credits(type, id),
        this.tmdb.videos(type, id),
        this.tmdb.recs(type, id),
      ]);
      return { details, credits, videos, recommendations };
    });
  }
}
