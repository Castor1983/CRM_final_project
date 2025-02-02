import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenType } from '../database/enums/token-type.enum';
import { TokenService } from '../modules/auth/token.service';
import {ManagerRepository} from "../modules/repositories/services/manager.repository";
import {RefreshTokenRepository} from "../modules/repositories/services/refresh-token.repository";
import {ManagerMapper} from "../modules/managers/manager.mapper";

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly managerRepository: ManagerRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenExist =
      await this.refreshTokenRepository.isRefreshTokenExist(refreshToken);
    if (!isRefreshTokenExist) {
      throw new UnauthorizedException();
    }

    const manager = await this.managerRepository.findOneBy({
      id: payload.managerId,
    });
    if (!manager) {
      throw new UnauthorizedException();
    }
    request.manager = ManagerMapper.toIManagerData(manager, payload);
    return true;
  }
}
