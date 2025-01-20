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
import { IUserData } from 'src/interfaces/user-data.interface';


@ApiTags('Login')
@Controller('login')
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
      @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.signOut(userData);
  }
}