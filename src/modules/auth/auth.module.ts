import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthCacheService } from './auth-cache.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ManagersModule } from '../managers/managers.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [JwtModule, RedisModule, forwardRef(() => ManagersModule)],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthCacheService],
  exports: [TokenService, AuthCacheService],
})
export class AuthModule {}
