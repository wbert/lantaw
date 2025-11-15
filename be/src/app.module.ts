import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config/config.module';
import { CacheModule } from './common/cache/cache.module';
import { CacheService } from './common/cache.service';
import { HealthController } from './health/health.controller';
import { ConfigService } from './common/config.service';
import { TmdbModule } from './features/tmdb/tmdb.module';
import { TmdbService } from './features/tmdb.service';
import { DiscoverController } from './features/discover/discover.controller';
import { DiscoverService } from './features/discover.service';
import { MediaController } from './features/media/media.controller';
import { MediaService } from './features/media.service';
import { SearchController } from './features/search/search.controller';
import { SearchService } from './features/search.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    TmdbModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 120,
        },
      ],
    }),
  ],
  controllers: [
    AppController,
    HealthController,
    DiscoverController,
    MediaController,
    SearchController,
  ],
  providers: [
    AppService,
    ConfigService,
    CacheService,
    TmdbService,
    DiscoverService,
    MediaService,
    SearchService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
