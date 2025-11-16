import fetch from 'node-fetch';
import { Injectable, Logger } from '@nestjs/common';

const BASE = 'https://api.themoviedb.org/3';
const H = () => ({ Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}` });

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);

  private async get(path: string, qs?: Record<string, string>, retries = 3) {
    const url = `${BASE}/${path}${qs ? `?${new URLSearchParams(qs)}` : ''}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const r = await fetch(url, {
          headers: H(),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!r.ok) {
          throw new Error(`TMDB ${r.status}`);
        }

        return await r.json();
      } catch (error) {
        const isLastAttempt = attempt === retries;

        this.logger.warn(
          `TMDB request failed (attempt ${attempt}/${retries}): ${path}`,
          error.message,
        );

        if (isLastAttempt) {
          this.logger.error(
            `TMDB request failed after ${retries} attempts: ${path}`,
          );
          throw error;
        }

        // Exponential backoff: 500ms, 1000ms, 2000ms
        const delay = 500 * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  details(type: 'movie' | 'tv', id: number) {
    return this.get(`/${type}/${id}`, { language: 'en-US' });
  }

  credits(type: 'movie' | 'tv', id: number) {
    return this.get(`/${type}/${id}/credits`, { language: 'en-US' });
  }

  videos(type: 'movie' | 'tv', id: number) {
    return this.get(`/${type}/${id}/videos`, { language: 'en-US' });
  }

  recs(type: 'movie' | 'tv', id: number) {
    return this.get(`/${type}/${id}/recommendations`, { language: 'en-US' });
  }

  discover(type: 'movie' | 'tv', q: Record<string, string>) {
    return this.get(`discover/${type}`, {
      include_adult: 'false',
      language: 'en-US',
      ...q,
    });
  }

  searchMulti(q: string, page = 1) {
    return this.get(`search/multi`, {
      query: q,
      page: String(page),
      include_adult: 'false',
      language: 'en-US',
    });
  }
}
