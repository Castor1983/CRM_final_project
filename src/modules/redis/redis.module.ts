import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';
import { Config, RedisConfig } from '../../configs/config.type';

const redisProvider: Provider = {
  useFactory: (configService: ConfigService<Config>): Redis => {
    const redisConfig = configService.get<RedisConfig>('redis');

    return new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
    });
  },
  inject: [ConfigService],
  provide: REDIS_CLIENT,
};

@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
