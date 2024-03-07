import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}
  @ApiOperation({
    summary: 'Health Probe',
  })
  @Get()
  getHealth(): string {
    return this.appService.getHealth();
  }
}
