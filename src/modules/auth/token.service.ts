import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JwtConfig } from '../../configs/config.type';
import { TokenType } from '../../database/enums/token-type.enum';
import { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import { ITokenActivate } from '../../interfaces/token-activate.interface';
import { ITokenPair } from '../../interfaces/token-pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }

  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
  public async generateActivateToken(
    payload: IJwtPayload,
  ): Promise<ITokenActivate> {
    const activateToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.activateSecret,
      expiresIn: this.jwtConfig.activateExpiresIn,
    });
    return { activateToken };
  }

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error);
    }
  }

  private getSecret(type: TokenType): string {
    let secret: string;
    switch (type) {
      case TokenType.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenType.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      case TokenType.ACTIVATE:
        secret = this.jwtConfig.activateSecret;
        break;
      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }
}
