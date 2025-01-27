import {
  Body,
  Controller, Get, HttpCode,
  Post, Query, Res, UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import {ApiBearerAuth, ApiQuery, ApiTags} from '@nestjs/swagger';
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {ManagerCreateDto} from "./dto/create-manager.dto";
import {RolesGuard} from "../../guards/roles.guard";
import {ManagerRole} from "../../database/enums/managerRole.enum";
import {Roles} from "../../decorators/roles.decorator";



@ApiTags('Managers')
@Controller('managers')
@UseGuards(RolesGuard, JwtAccessGuard)
export class ManagersController {
  constructor(private readonly managersService: ManagersService,
             ) {}

  @ApiBearerAuth()
  @Post()
  @Roles(ManagerRole.ADMIN)
  create(@Body() dto: ManagerCreateDto) {
    return this.managersService.create(dto);
  }

  @Post('activate/:managerId')
  @HttpCode(200)
  async activateManager(@Query() managerId: string) {
    return this.managersService.activate(managerId);

  }

}
