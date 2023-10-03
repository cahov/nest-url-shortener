import { Controller, Get } from '@nestjs/common';

@Controller('shortener')
export class ShortenerController {
  @Get()
  hola() {
    return 'hola mundo';
  }
}
