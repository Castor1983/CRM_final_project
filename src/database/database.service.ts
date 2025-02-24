import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { MysqlConfig } from "../configs/config.type";
import * as path from "node:path";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const msqlConfig = this.configService.get<MysqlConfig>("mysql");
    return {
      type: "mysql",
      host: msqlConfig.host,
      port: msqlConfig.port,
      username: msqlConfig.user,
      password: msqlConfig.password,
      database: msqlConfig.dbName,
      entities: [
        path.join(
          process.cwd(),
          "dist",
          "src",
          "database",
          "entities",
          "*.entity.js",
        ),
      ],
      migrations: [
        path.join(
          process.cwd(),
          "dist",
          "src",
          "database",
          "migrations",
          "*.js",
        ),
      ],
      migrationsRun: false,
      synchronize: false,
    };
  }
}
