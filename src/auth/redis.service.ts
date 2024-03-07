import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      port: configService.get<number>('redis.port'),
      host: configService.get<string>('redis.host'),
      password: configService.get<string>('redis.password'),
    });
  }

  async addToBlacklist(token: string) {
    try {
      // Add token to blacklist with an expiration time
      await this.client.set(
        token,
        'revoked',
        'EX',
        this.configService.get<number>('jwt.revocationSeconds'),
      );
    } catch (error) {
      console.error('Error adding token to blacklist:', error);
    }
  }

  async isTokenRevoked(sessonid: string): Promise<boolean> {
    try {
      // Check if sessionid is in the blacklist
      const result = await this.client.exists(sessonid);
      return result === 1;
    } catch (error) {
      console.error('Error checking if  token is revoked:', error);
      return null;
    }
  }
}
