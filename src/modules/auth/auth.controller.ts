import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { IManagerData } from 'src/interfaces/manager-data.interface';

import { AuthService } from './auth.service';
import { SignInReqDto } from './dto/sign-in.req.dto';
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
  public async signIn(@Body() dto: SignInReqDto, @Res() res: Response) {
    const { accessToken, manager } = await this.authService.signIn(dto, res);
    return res.json({ accessToken, manager });
  }
  @SkipAuth()
  @Post('refresh')
  public async refresh(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.refresh(req, res);
    return res.json({ accessToken });
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  public async signOut(
    @Res() res: Response,
    @CurrentUser() managerData: IManagerData,
  ): Promise<void> {
    await this.authService.signOut(res, managerData);
  }
}
