import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TokenService} from "./token.service";
import {AuthCacheService} from "./auth-cache.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {RedisService} from "../redis/redis.service";
import {RedisModule} from "../redis/redis.module";
import {ManagersModule} from "../managers/managers.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtAccessGuard} from "../../guards/jwt-access.guard";

@Module({
    imports: [JwtModule, RedisModule, ManagersModule],
    controllers: [AuthController],
    providers: [ {
        provide: APP_GUARD,
        useClass: JwtAccessGuard,
    },AuthService, TokenService, AuthCacheService],
})
export class AuthModule {}