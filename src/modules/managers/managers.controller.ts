import {
  Body,
  Controller,  HttpCode, Param,
  Post, UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @Roles(ManagerRole.ADMIN)
  @Post('activate/:managerId')
  @HttpCode(200)
  async activateManager(@Param('managerId') managerId: string) {
    return this.managersService.activate(managerId);

  }

}
