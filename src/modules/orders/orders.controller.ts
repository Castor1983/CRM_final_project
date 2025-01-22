import {
  Controller,

  Get,
 Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {SkipAuth} from "../../decorators/skip-auth.decorator";
import {PaginationDto} from "./dto/pagination-order.dto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @SkipAuth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

}
