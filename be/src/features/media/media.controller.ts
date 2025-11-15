import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MediaService } from '../media.service';
@Controller('v1/media')
export class MediaController {
  constructor(private svc: MediaService) {}
  @Get(':type/:id')
  bundle(
    @Param('type') type: 'movie' | 'tv',
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.bundle(type, id);
  }
}
