import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    // Get API health
    return 'I am healthy';
  }
}
