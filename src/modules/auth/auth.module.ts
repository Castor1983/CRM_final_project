import {forwardRef, Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TokenService} from "./token.service";
import {AuthCacheService} from "./auth-cache.service";
import {JwtModule} from "@nestjs/jwt";
import {RedisModule} from "../redis/redis.module";
import {ManagersModule} from "../managers/managers.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtAccessGuard} from "../../guards/jwt-access.guard";

@Module({
    imports: [JwtModule, RedisModule, forwardRef(() => ManagersModule)],
    controllers: [AuthController],
    providers: [ {
        provide: APP_GUARD,
        useClass: JwtAccessGuard,
    },AuthService, TokenService, AuthCacheService],
    exports: [TokenService, AuthCacheService],
})
export class AuthModule {}