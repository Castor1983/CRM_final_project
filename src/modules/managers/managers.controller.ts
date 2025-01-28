import {
  Body,
  Controller, Get, HttpCode, Param,
  Post, Query, UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {ManagerCreateDto} from "./dto/create-manager.dto";
import {RolesGuard} from "../../guards/roles.guard";
import {ManagerRole} from "../../database/enums/managerRole.enum";
import {Roles} from "../../decorators/roles.decorator";
import {CreatePasswordDto} from "./dto/createPassword.dto";
import {SkipAuth} from "../../decorators/skip-auth.decorator";
import {PaginationDto} from "../orders/dto/pagination-order.dto";



@ApiTags('Managers')
@Controller('managers')

export class ManagersController {
  constructor(private readonly managersService: ManagersService,
             ) {}

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Post()
  @Roles(ManagerRole.ADMIN)
  create(@Body() dto: ManagerCreateDto) {
    return this.managersService.create(dto);
  }
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Get()
  @Roles(ManagerRole.ADMIN)
  getAllManagers(@Query() dto: PaginationDto) {
    return this.managersService.getAll(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(ManagerRole.ADMIN)
  @Post('activate/manager/:managerId')
  @HttpCode(200)
  async activateManager(@Param('managerId') managerId: string) {
    return this.managersService.activate(managerId);

  }
  @SkipAuth()
  @Post('activate/:activateToken')
  @HttpCode(200)
  async createPassword( @Param('activateToken') activateToken: string, @Body() dto: CreatePasswordDto) {
    return this.managersService.createPassword(activateToken, dto);

  }
}
