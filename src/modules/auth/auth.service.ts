import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { ManagerRepository } from '../repositories/services/manager.repository';
import { TokenPairResDto } from './dto/token-pair.res.dto';
import {TokenService} from "./token.service";
import {RefreshTokenRepository} from "../repositories/services/refresh-token.repository";
import {IManagerData} from "../../interfaces/manager-data.interface";
import {AuthCacheService} from "./auth-cache.service";
import {AuthResDto} from "./dto/auth.res.dto";

@Injectable()
export class AuthService {
  constructor(
      private readonly refreshTokenRepository: RefreshTokenRepository,
      private readonly managerRepository: ManagerRepository,
      private readonly tokenService: TokenService,
      private readonly authCacheService: AuthCacheService,
  ) {}

    public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, role: true, surname: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(dto.password, manager.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.generateAuthTokens({
      managerId: manager.id,
      surname: manager.surname,
      role: manager.role
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: manager.id
      }),
      this.authCacheService.deleteToken(manager.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        refreshToken: tokens.refreshToken,
        managerId: manager.id,
        role: manager.role
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          manager.id,
      ),
    ]);
    manager.last_login = new Date();
      await this.managerRepository.save(manager);
    const managerEntity = await this.managerRepository.findOneBy({ id: manager.id });
    return { manager: managerEntity, tokens };
  }

  public async refresh(managerData: IManagerData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      managerId: managerData.managerId,
      surname: managerData.surname,
      role: managerData.role
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        refreshToken: tokens.refreshToken,
        managerId: managerData.managerId,
        role: managerData.role
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          managerData.managerId,
      ),
    ]);

    return tokens;
  }
  public async signOut(managerData: IManagerData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        managerId: managerData.managerId,
      }),
      this.authCacheService.deleteToken(managerData.managerId),
    ]);
  }
}