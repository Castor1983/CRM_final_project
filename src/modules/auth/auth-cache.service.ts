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
    deviceId: string,
  ): Promise<void> {
    const key = this.getKey(managerId, deviceId);

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, token);
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
  }

  public async isAccessTokenExist(
    managerId: string,
    deviceId: string,
    token: string,
  ): Promise<boolean> {
    const key = this.getKey(managerId, deviceId);
    const set = await this.redisService.sMembers(key);
    return set.includes(token);
  }

  public async deleteToken(managerId: string, deviceId: string): Promise<void> {
    const key = this.getKey(managerId, deviceId);
    await this.redisService.deleteByKey(key);
  }

  private getKey(managerId: string, deviceId: string): string {
    return `ACCESS_TOKEN:${managerId}:${deviceId}`;
  }
}
