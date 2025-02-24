import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { JwtAccessGuard } from '../../guards/jwt-access.guard';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [JwtModule, OrdersModule, forwardRef(() => AuthModule)],
  controllers: [ManagersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    ManagersService,
  ],
  exports: [ManagersService],
})
export class ManagersModule {}
