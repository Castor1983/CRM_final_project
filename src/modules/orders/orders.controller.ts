
import {
  Body,
  Controller,
  Get, HttpCode, Param, Patch, Post,
  Query, Req, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {PaginationDto} from "./dto/pagination-order.dto";
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {CreateGroupDto} from "./dto/create-group.dto";


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
  public async exportOrders(@Query() paginationDto: PaginationDto,  @Req() req: CustomRequest) {
    const managerId = req.manager.managerId
    return  await this.ordersService.exportToExcel(paginationDto, managerId);

  }
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Get('groups')
  async getAllGroups() {
    return this.ordersService.getAllGroups();
  }
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post('groups')
  async createGroup(@Body() dto: CreateGroupDto) {
    return this.ordersService.createGroup(dto);
  }


@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Get(':orderId')
  public async getOrderById (@Param('orderId') orderId: string) {
    return  this.ordersService.getOrderById(orderId)
}
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Post('addComment/:orderId')
  public async createComment (@Body() dto: CreateCommentDto, @Param('orderId') orderId: string,  @Req() req: CustomRequest) {
    const {managerId, surname} = req.manager
    return  this.ordersService.createComment(orderId, dto, managerId, surname)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Patch('edit/:orderId')
  public async updateOrder (@Body() dto: UpdateOrderDto, @Param('orderId') orderId: string, @Req() req: CustomRequest) {
    const {surname, managerId} = req.manager
    return  this.ordersService.updateOrder(dto, orderId, surname, managerId)
  }

}






