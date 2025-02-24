import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { MysqlConfig } from '../configs/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const msqlConfig = this.configService.get<MysqlConfig>('mysql');
    return {
      type: 'mysql',
      host: msqlConfig.host,
      port: msqlConfig.port,
      username: msqlConfig.user,
      password: msqlConfig.password,
      database: msqlConfig.dbName,
      entities: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'entities',
          '*.entity.js',
        ),
      ],
      migrations: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'migrations',
          '*.js',
        ),
      ],
      migrationsRun: false,
      synchronize: false,
    };
  }
}
