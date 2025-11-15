import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../search.service';

@Controller('v1/search')
export class SearchController {
  constructor(private svc: SearchService) {}
  @Get()
  search(@Query('q') q = '', @Query('page') page = 1) {
    return this.svc.search(q, Number(page));
  }
}
