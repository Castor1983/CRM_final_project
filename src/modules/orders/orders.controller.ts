import * as dayjs from 'dayjs';
import {
  Controller,
  Get, Param, Post,
  Query, Req, Res, UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import {PaginationDto} from "./dto/pagination-order.dto";
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {CreateCommentDto} from "./dto/create-comment.dto";


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @ApiQuery({
    name: 'filters',
    type: PaginationDto,
    required: false,
    description: 'Filters for orders',
  })
  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Req() req: CustomRequest) {
    const managerId = req.manager.managerId
    return this.ordersService.findAll(paginationDto, managerId);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'filters',
    type: PaginationDto,
    required: false,
    description: 'Filters for orders',
  })
  @UseGuards(JwtAccessGuard)
  @Get('export')
  public async exportOrders(@Query() paginationDto: PaginationDto,  @Req() req: CustomRequest,  @Res() res: Response) {
    const managerId = req.manager.managerId
    const fileBuffer = await this.ordersService.exportToExcel(paginationDto, managerId);
    const dateStr = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    res.setHeader('Content-Disposition', `attachment; filename="orders_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return res.send(fileBuffer);
  }

@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Get(':orderId')
  public async getOrderById (@Param('orderId') orderId: string) {
    return  this.ordersService.getOrderById(orderId)
}
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post(':orderId')
  public async createComment (@Param('orderId') orderId: string, dto: CreateCommentDto) {

    return  this.ordersService.createComment(orderId, dto)
  }
}






