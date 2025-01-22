import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerReqDto } from './dto/create-manager.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  create(@Body() managerReqDto: ManagerReqDto) {
    return this.managersService.create(managerReqDto);
  }

}
