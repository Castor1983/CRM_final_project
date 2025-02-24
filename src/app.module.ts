import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ManagersModule } from './modules/managers/managers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repositories/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    RepositoryModule,
    RedisModule,
    AuthModule,
    ManagersModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
