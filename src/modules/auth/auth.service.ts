import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInReqDto } from './dto/sign-in.req.dto';
import { ManagerRepository } from '../repositories/services/manager.repository';
import { TokenPairResDto } from './dto/token-pair.res.dto';
import {TokenService} from "./token.service";


@Injectable()
export class AuthService {
  constructor(
      private readonly refreshTokenRepository: RefreshTokenRepository,
      private readonly managerRepository: ManagerRepository,
      private readonly userService: UsersService,
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
      managerId: manager.id,

    });

    await Promise.all([
      this.refreshTokenRepository.delete({

        user_id: manager.id,
      }),
      this.authCacheService.deleteToken(manager.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: dto.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: manager.id,
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          manager.id,
          dto.deviceId,
      ),
    ]);
    const managerEntity = await this.managerRepository.findOneBy({ id: manager.id });
    return { user: managerEntity, tokens };
  }
  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: userData.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: userData.userId,
      }),
      this.authCacheService.saveToken(
          tokens.accessToken,
          userData.userId,
          userData.deviceId,
      ),
    ]);

    return tokens;
  }
  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }
}