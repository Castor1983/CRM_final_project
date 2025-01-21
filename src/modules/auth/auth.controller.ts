import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { AuthResDto } from './dto/auth.res.dto';
import { TokenPairResDto } from './dto/token-pair.res.dto';
import {IManagerData, } from 'src/interfaces/manager-data.interface';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  public async signOut(@CurrentUser() managerData: IManagerData): Promise<void> {
    await this.authService.signOut(managerData);
  }
}