// src/v1/controllers/discover.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { DiscoverService } from '../discover.service';

@Controller('v1/discover')
export class DiscoverController {
  constructor(private svc: DiscoverService) {}

  @Get()
  list(
    @Query('type') type: 'movie' | 'tv' = 'movie',
    @Query() allParams: Record<string, string>,
  ) {
    const { type: _, ...queryParams } = allParams;

    return this.svc.list(type, queryParams);
  }
}
