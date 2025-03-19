import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';

import { AuthCacheService } from './auth-cache.service';
import { AuthResDto } from './dto/auth.res.dto';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { TokenService } from './token.service';
import { TokenType } from '../../database/enums/token-type.enum';
import { IManagerData } from '../../interfaces/manager-data.interface';
import { ManagerRepository } from '../repositories/services/manager.repository';
import { RefreshTokenRepository } from '../repositories/services/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly managerRepository: ManagerRepository,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async signIn(dto: SignInReqDto, res: Response): Promise<AuthResDto> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, role: true, surname: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      manager.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.generateAuthTokens({
      managerId: manager.id,
      surname: manager.surname,
      role: manager.role,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: manager.id,
      }),
      this.authCacheService.deleteToken(manager.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        refreshToken: tokens.refreshToken,
        managerId: manager.id,
        role: manager.role,
      }),
      this.authCacheService.saveToken(tokens.accessToken, manager.id),
    ]);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    manager.last_login = new Date();
    await this.managerRepository.save(manager);
    const managerEntity = await this.managerRepository.findOneBy({
      id: manager.id,
    });
    return { manager: managerEntity, accessToken: tokens.accessToken };
  }

  public async refresh(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken: string = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    const managerData = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      managerId: managerData.managerId,
      surname: managerData.surname,
      role: managerData.role,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        refreshToken: tokens.refreshToken,
        managerId: managerData.managerId,
        role: managerData.role,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        managerData.managerId,
      ),
    ]);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }
  public async signOut(
    res: Response,
    managerData: IManagerData,
  ): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId),
    ]);
    res.clearCookie('refreshToken');
  }
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
