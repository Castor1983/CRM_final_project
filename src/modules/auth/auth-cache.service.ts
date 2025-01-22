import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JwtConfig } from '../../configs/config.type';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JwtConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  public async saveToken(
    token: string,
    managerId: string,
  ): Promise<void> {
    const key = this.getKey(managerId);

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, token);
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
  }

  public async isAccessTokenExist(
    managerId: string,
    token: string,
  ): Promise<boolean> {
    const key = this.getKey(managerId);
    const set = await this.redisService.sMembers(key);
    return set.includes(token);
  }

  public async deleteToken(managerId: string): Promise<void> {
    const key = this.getKey(managerId);
    await this.redisService.deleteByKey(key);
  }

  private getKey(managerId: string): string {
    return `ACCESS_TOKEN:${managerId}`;
  }
}
