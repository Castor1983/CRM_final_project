import * as dayjs from 'dayjs';
import {
  Controller,
  Get,
  Query, Res, UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import {PaginationDto} from "./dto/pagination-order.dto";
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";
import {OrderColumnsNameEnum} from "../../database/enums/orderColumnsName.enum";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {CourseFormatEnum} from "../../database/enums/courseFormat.enum";
import {CourseTypeEnum} from "../../database/enums/courseType.enum";
import {StatusEnum} from "../../database/enums/status.enum";
import {CourseEnum} from "../../database/enums/course.enum";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number'} )
  @ApiQuery({ name: 'sort', required: false, enum: OrderColumnsNameEnum, description: 'Sort by columns name'} )
  @ApiQuery({ name: 'order', required: false, enum: DescAscEnum, description: 'ASC/DESC'} )
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name'} )
  @ApiQuery({ name: 'surname', required: false, type: String, description: 'Filter by surname'} )
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter by email'} )
  @ApiQuery({ name: 'phone', required: false, type: String, description: 'Filter by phone'} )
  @ApiQuery({ name: 'age', required: false, type: Number, description: 'Filter by age'} )
  @ApiQuery({ name: 'course_format', required: false, enum: CourseFormatEnum, description: 'Filter by course format'} )
  @ApiQuery({ name: 'course_type', required: false, enum: CourseTypeEnum, description: 'Filter by course type'} )
  @ApiQuery({ name: 'status', required: false, enum: StatusEnum, description: 'Filter by status'} )
  @ApiQuery({ name: 'course', required: false, enum: CourseEnum, description: 'Filter by course'} )
//todo group and me
  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number'} )
  @ApiQuery({ name: 'sort', required: false, enum: OrderColumnsNameEnum, description: 'Sort by columns name'} )
  @ApiQuery({ name: 'order', required: false, enum: DescAscEnum, description: 'ASC/DESC'} )
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name'} )
  @ApiQuery({ name: 'surname', required: false, type: String, description: 'Filter by surname'} )
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter by email'} )
  @ApiQuery({ name: 'phone', required: false, type: String, description: 'Filter by phone'} )
  @ApiQuery({ name: 'age', required: false, type: Number, description: 'Filter by age'} )
  @ApiQuery({ name: 'course_format', required: false, enum: CourseFormatEnum, description: 'Filter by course format'} )
  @ApiQuery({ name: 'course_type', required: false, enum: CourseTypeEnum, description: 'Filter by course type'} )
  @ApiQuery({ name: 'status', required: false, enum: StatusEnum, description: 'Filter by status'} )
  @ApiQuery({ name: 'course', required: false, enum: CourseEnum, description: 'Filter by course'} )
//todo group and me
  @UseGuards(JwtAccessGuard)
  @Get('export')
  public async exportOrders(@Query() paginationDto: PaginationDto, @Res() res: Response) {
    const fileBuffer = await this.ordersService.exportToExcel(paginationDto);
    const dateStr = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    res.setHeader('Content-Disposition', `attachment; filename="orders_${dateStr}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return res.send(fileBuffer);
  }

}
