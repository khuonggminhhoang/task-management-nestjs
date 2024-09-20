import { Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new NotFoundException();
    return 'Hello World!';
  }
}
