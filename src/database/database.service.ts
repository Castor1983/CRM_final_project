import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {MysqlConfig} from "../configs/config.type";
import * as path from 'node:path';
import {ManagerEntity} from "./entities/manager.entity";
import {OrderEntity} from "./entities/order.entity";
import {RefreshTokenEntity} from "./entities/refresh-token.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        const msqlConfig = this.configService.get<MysqlConfig>('mysql');
        console.log(path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),)
        return {
            type: 'mysql',
            host: msqlConfig.host,
            port: msqlConfig.port,
            username: msqlConfig.user,
            password: msqlConfig.password,
            database: msqlConfig.dbName,
            entities: [
                ManagerEntity, OrderEntity, RefreshTokenEntity
            ],
            migrations: [

            ],
            migrationsRun: true,
            synchronize: false,
        };
    }
}