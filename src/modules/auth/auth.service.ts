import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { ManagerRepository } from '../repositories/services/manager.repository';
import { TokenPairResDto } from './dto/token-pair.res.dto';
import {TokenService} from "./token.service";
import {RefreshTokenRepository} from "../repositories/services/refresh-token.repository";
import {IManagerData} from "../../interfaces/manager-data.interface";
import {AuthCacheService} from "./auth-cache.service";


@Injectable()
export class AuthService {
  constructor(
      private readonly refreshTokenRepository: RefreshTokenRepository,
      private readonly managerRepository: ManagerRepository,
      private readonly tokenService: TokenService,
      private readonly authCacheService: AuthCacheService,
  ) {}

    public async signIn(dto: SignInReqDto): Promise<any> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = bcrypt.compare(dto.password, manager.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.generateAuthTokens({
      managerId: manager.id.toString(),
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        manager_id: manager.id.toString(),
        deviceId: dto.deviceId,
      }),
      this.authCacheService.deleteToken(manager.id.toString(), dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: dto.deviceId,
        refreshToken: tokens.refreshToken,
        manger_id: manager.id,
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          manager.id.toString(),
          dto.deviceId,
      ),
    ]);
    const managerEntity = await this.managerRepository.findOneBy({ id: manager.id });
    return { manager: managerEntity, tokens };
  }
  public async refresh(managerData: IManagerData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: managerData.deviceId,
        manager_id: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId, managerData.deviceId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      managerId: managerData.managerId,
      deviceId: managerData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: managerData.deviceId,
        refreshToken: tokens.refreshToken,
        manager_id: managerData.managerId,
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          managerData.managerId,
          managerData.deviceId,
      ),
    ]);

    return tokens;
  }
  public async signOut(managerData: IManagerData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: managerData.deviceId,
        manager_id: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId, managerData.deviceId),
    ]);
  }
}