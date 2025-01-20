import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {ManagerEntity} from "./entities/manager.entity";
import {MysqlConfig} from "../configs/config.type";

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
            entities: [ManagerEntity],
            // migrations
            synchronize: true,
        };
    }
}