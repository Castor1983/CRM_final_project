import {
  Body,
  Controller, Get, HttpCode,
  Post, Query, Res, UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {ManagerCreateDto} from "./dto/create-manager.dto";
import {RolesGuard} from "../../guards/roles.guard";
import {ManagerRole} from "../../database/enums/managerRole.enum";
import {Roles} from "../../decorators/roles.decorator";

import {TokenService} from "../auth/token.service";
import {IJwtPayload} from "../../interfaces/jwt-payload.interface";
import {ITokenActivate} from "../../interfaces/token-activate.interface";

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

  @Get('activate')
  @HttpCode(200)
  async verifyManager(@Query('token') dto: ITokenActivate) {
   return this.managersService.verify(dto)
  }

  @Post('activate')
  @HttpCode(200)
  async activateManager(@Body() payload: IJwtPayload) {
    return this.managersService.activate(payload);
  }

}
