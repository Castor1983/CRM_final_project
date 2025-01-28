import {forwardRef, Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TokenService} from "./token.service";
import {AuthCacheService} from "./auth-cache.service";
import {JwtModule} from "@nestjs/jwt";
import {RedisModule} from "../redis/redis.module";
import {ManagersModule} from "../managers/managers.module";

@Module({
    imports: [JwtModule, RedisModule, forwardRef(() => ManagersModule)],
    controllers: [AuthController],
    providers: [ AuthService, TokenService, AuthCacheService],
    exports: [TokenService, AuthCacheService],
})
export class AuthModule {}