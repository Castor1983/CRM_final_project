import {Injectable} from '@nestjs/common';
import clipboard from 'clipboardy';

import { ManagerCreateDto } from './dto/create-manager.dto';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { ManagerRepository } from '../repositories/services/manager.repository';
import {TokenService} from "../auth/token.service";
import {ConfigService} from "@nestjs/config/dist/config.service";
import {AppConfig, Config} from "../../configs/config.type";
import {IActivateManager} from "../../interfaces/activate-manager.interface";


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

public async activate(dto: string): Promise<IActivateManager> {

      const manager = await this.managerRepository.findOneBy({id: +dto})
if(!manager) {
    throw new Error('Manager not found')
}
if (manager.is_active){
    throw new Error('Manager is active')
}
const payload = {managerId: manager.id.toString(), role: manager.role}
    const token = await this.tokenService.generateActivateToken(payload);

    const activationLink = `http://${this.appConfig.host}:${this.appConfig.port}/activate/${token}`;

 clipboard.writeSync(activationLink);
    await this.managerRepository.update(manager.id, {is_active: true} )
  return {
    message: 'Activation link has been generated and copied to clipboard',
    activationLink,
  };
}
}
