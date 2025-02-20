import {forwardRef, Module} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [forwardRef(() => AuthModule) ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
