import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerReqDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  create(@Body() managerReqDto: ManagerReqDto) {
    return this.managersService.create(managerReqDto);
  }

  @Get()
  findAll() {
    return this.managersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managersService.remove(+id);
  }
}
