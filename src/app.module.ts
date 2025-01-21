import { Module } from '@nestjs/common';
import {DatabaseModule} from "./database/database.module";
import {ConfigModule} from "@nestjs/config";
import configuration from "./configs/configuration";
import {RepositoryModule} from "./modules/repositories/repository.module";
import {RedisModule} from "./modules/redis/redis.module";
import {AuthModule} from "./modules/auth/auth.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        DatabaseModule,
        RepositoryModule,
        RedisModule,
        AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}