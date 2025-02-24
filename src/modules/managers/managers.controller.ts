import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ManagersService } from "./managers.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ManagerCreateDto } from "./dto/create-manager.dto";
import { RolesGuard } from "../../guards/roles.guard";
import { ManagerRole } from "../../database/enums/managerRole.enum";
import { Roles } from "../../decorators/roles.decorator";
import { CreatePasswordDto } from "./dto/createPassword.dto";
import { SkipAuth } from "../../decorators/skip-auth.decorator";
import { UniqueEmailGuard } from "../../guards/unique-email.guard";

@ApiTags("Managers")
@Controller("managers")
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @ApiBearerAuth()
  @UseGuards(RolesGuard, UniqueEmailGuard)
  @Post()
  @Roles(ManagerRole.ADMIN)
  create(@Body() dto: ManagerCreateDto) {
    return this.managersService.create(dto);
  }
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Get()
  @Roles(ManagerRole.ADMIN)
  getAllManagers() {
    return this.managersService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(ManagerRole.ADMIN)
  @Post("activate/manager/:managerId")
  @HttpCode(200)
  async activateManager(@Param("managerId") managerId: string) {
    return this.managersService.activate(managerId);
  }
  @SkipAuth()
  @Post("activate/:activateToken")
  @HttpCode(200)
  async createPassword(
    @Param("activateToken") activateToken: string,
    @Body() dto: CreatePasswordDto,
  ) {
    return this.managersService.createPassword(activateToken, dto);
  }
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(ManagerRole.ADMIN)
  @Post("deactivate/:managerId")
  @HttpCode(200)
  async recoveryPassword(@Param("managerId") managerId: string) {
    return this.managersService.recoveryPassword(managerId);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(ManagerRole.ADMIN)
  @Patch("ban/:managerId")
  async banManager(@Param("managerId") managerId: string) {
    return this.managersService.banManager(managerId);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(ManagerRole.ADMIN)
  @Patch("unban/:managerId")
  async unbanManager(@Param("managerId") managerId: string) {
    return this.managersService.unbanManager(managerId);
  }
}
