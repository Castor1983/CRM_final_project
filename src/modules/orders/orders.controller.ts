import {
  Controller,

  Get,
 Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {SkipAuth} from "../../decorators/skip-auth.decorator";
import {PaginationDto} from "./dto/pagination-order.dto";
import {ApiQuery} from "@nestjs/swagger";
import {OrderColumnsNameEnum} from "../../database/enums/orderColumnsName.enum";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number' } )
  @ApiQuery({ name: 'sort', required: false, enum: OrderColumnsNameEnum, description: 'Sort by columns name' } )
  @ApiQuery({ name: 'order', required: false, enum: DescAscEnum, description: 'ASC/DESC' } )
  @SkipAuth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

}
