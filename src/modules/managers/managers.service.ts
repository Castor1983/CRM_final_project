import { Injectable } from '@nestjs/common';
import clipboard from 'clipboardy';

import { ManagerCreateDto } from './dto/create-manager.dto';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { ManagerRepository } from '../repositories/services/manager.repository';
import {IJwtPayload} from "../../interfaces/jwt-payload.interface";
import {TokenService} from "../auth/token.service";
import {ConfigService} from "@nestjs/config/dist/config.service";
import {AppConfig, Config} from "../../configs/config.type";
import {IActivateManager} from "../../interfaces/activate-manager.interface";
import {ITokenActivate} from "../../interfaces/token-activate.interface";

@Injectable()
export class ManagersService {

  constructor(
      private readonly appConfig: AppConfig,
      private readonly managerRepository: ManagerRepository,
      private readonly  tokenService: TokenService,
      private readonly configService: ConfigService<Config>,) {
    this.appConfig = configService.get<AppConfig>('app')
  }

  public async create(dto: ManagerCreateDto): Promise<ManagerEntity> {
try {
  return await this.managerRepository.save(dto);
}catch (e){
  throw new Error(e)
}

  }

public async activate(dto: IJwtPayload): Promise<IActivateManager> {

    const token = this.tokenService.generateActivateToken(dto);

    const activationLink = `http://${this.appConfig.host}:${this.appConfig.port}/activate/${token}`;

 clipboard.writeSync(activationLink);

  return {
    message: 'Activation link has been generated and copied to clipboard',
    activationLink,
  };
}

public async verify (dto: ITokenActivate) {
    try {
        const payload = this.tokenService.verifyToken(dto.activateToken, dto.type);


        return res.redirect(`/create-password?userId=${payload.}`);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
}
}
