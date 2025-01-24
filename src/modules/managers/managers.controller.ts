import {
  Body,
  Controller,
  Post, UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAccessGuard} from "../../guards/jwt-access.guard";
import {ManagerCreateDto} from "./dto/create-manager.dto";

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAccessGuard)
  create(@Body() dto: ManagerCreateDto) {
    return this.managersService.create(dto);
  }

}
