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

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number'} )
  @ApiQuery({ name: 'sort', required: false, enum: OrderColumnsNameEnum, description: 'Sort by columns name'} )
  @ApiQuery({ name: 'order', required: false, enum: DescAscEnum, description: 'ASC/DESC'} )
  /*@ApiQuery({ name: 'name', required: false, type: 'string', description: 'Filter by name', nullable: true  })
  @ApiQuery({ name: 'surname', required: false, type: 'string', description: 'Filter by surname', nullable: true  })
  @ApiQuery({ name: 'email', required: false, type: 'string', description: 'Filter by email', nullable: true  })
  @ApiQuery({ name: 'phone', required: false, type: 'string', description: 'Filter by phone', nullable: true  })
  @ApiQuery({ name: 'age', required: false, type: 'number', description: 'Filter by age', nullable: true  })*/
  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto)
    return this.ordersService.findAll(paginationDto);
  }


}
