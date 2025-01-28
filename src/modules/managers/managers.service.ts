import {Injectable} from '@nestjs/common';
import clipboard from 'clipboardy';

import {ManagerCreateDto} from './dto/create-manager.dto';
import {ManagerEntity} from 'src/database/entities/manager.entity';
import {ManagerRepository} from '../repositories/services/manager.repository';
import {TokenService} from "../auth/token.service";
import {ConfigService} from "@nestjs/config/dist/config.service";
import {AppConfig, Config} from "../../configs/config.type";
import {IActivateManager} from "../../interfaces/activate-manager.interface";
import {CreatePasswordDto} from "./dto/createPassword.dto";
import {TokenType} from "../../database/enums/token-type.enum";
import * as bcrypt from "bcryptjs";


@Injectable()
export class ManagersService {
    private readonly appConfig: AppConfig;
  constructor(
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

public async activate(dto: string): Promise<IActivateManager> {

      const manager = await this.managerRepository.findOneBy({id: +dto})

if(!manager) {
    throw new Error('Manager not found')
}
if (manager.is_active){
    throw new Error('Manager is active')
}

const payload = {managerId: manager.id.toString(), role: manager.role}
    const {activateToken} = await this.tokenService.generateActivateToken(payload);

    const activationLink = `http://${this.appConfig.host}:${this.appConfig.port}/managers/activate/${activateToken}`;

 clipboard.writeSync(activationLink);
  return {
    message: 'Activation link has been generated and copied to clipboard',
    activationLink,
      activateToken
  };
}

public async createPassword (token: string, dto: CreatePasswordDto) {

    const payload = await this.tokenService.verifyToken(token, TokenType.ACTIVATE);
      if (dto.password === dto.confirmPassword) {
          const hashPassword = await bcrypt.hash(dto.password, 10);
           await this.managerRepository.update(+payload.managerId, {password: hashPassword, is_active: true})
      }
      return { message: 'Password create is successful'}
}
}
