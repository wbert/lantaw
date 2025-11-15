import { Controller, Get, Query } from '@nestjs/common';
import { DiscoverService } from '../discover.service';

@Controller('v1/discover')
export class DiscoverController {
  constructor(private svc: DiscoverService) {}

  @Get()
  list(
    @Query('type') type: 'movie' | 'tv' = 'movie',
    @Query('page') q: Record<string, string>,
  ) {
    return this.svc.list(type, q);
  }
}
