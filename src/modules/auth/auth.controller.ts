import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { IManagerData } from 'src/interfaces/manager-data.interface';

import { AuthService } from './auth.service';
import { AuthResDto } from './dto/auth.res.dto';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { TokenPairResDto } from './dto/token-pair.res.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { BanGuard } from '../../guards/banned.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(BanGuard)
  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() managerData: IManagerData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(managerData);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  public async signOut(
    @CurrentUser() managerData: IManagerData,
  ): Promise<void> {
    await this.authService.signOut(managerData);
  }
}
