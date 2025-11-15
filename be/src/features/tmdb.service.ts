import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { query } from 'express';
const BASE = 'https://api.themoviedb.org/3';
const H = () => ({ Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}` });

@Injectable()
export class TmdbService {
  private async get(path: string, qs?: Record<string, string>) {
    const url = `${BASE}/${path}${qs ? `?${new URLSearchParams(qs)}` : ''}`;
    const r = await fetch(url, { headers: H() });
    if (!r.ok) throw new Error(`TMDB ${r.status}`);
    return r.json();
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
