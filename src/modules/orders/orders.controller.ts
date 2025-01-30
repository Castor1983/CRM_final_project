import {
  Controller,
  Get,
  Query, UseGuards,
} from '@nestjs/common';
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
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number'} )
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


}
