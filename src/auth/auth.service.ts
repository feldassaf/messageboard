import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RedisService } from './redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      // Validate user credentials
      const user = await this.usersService.findOneByUserName(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        password;
        return result;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async login(user: any) {
    try {
      // Create payload for JWT token
      const payload = {
        username: user.username,
        sub: user.id,
        sessionid: uuidv4(),
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error loggin in:', error);
    }
  }

  async logout(token: string) {
    try {
      const payload = await this.decodeJwt(token);
      // Add sessionid to blacklist in redis to avoid resuing logged out token
      await this.redisService.addToBlacklist(payload.sessionid);
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error loggin out:', error);
      return null;
    }
  }

  async decodeJwt(token: string) {
    try {
      const decoded = await this.jwtService.decode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error.message);
      return null;
    }
  }
}
