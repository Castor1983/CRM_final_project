import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
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
import {PaginationDto} from "../orders/dto/pagination-order.dto";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";
import {ManagerPaginationResDto} from "./dto/manager-pagination.res.dto";


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
    throw new HttpException(
        `Failed to create manager: ${e.message || e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,);
}

  }
    public async getAll(dto: PaginationDto): Promise<ManagerPaginationResDto> {
        const { page, limit} = dto;

        const queryBuilder = this.managerRepository.createQueryBuilder('order');

            queryBuilder.orderBy({id: DescAscEnum.DESC}).skip((page - 1) * limit).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();
        const total_pages = Math.ceil(total/limit)
        if (page > total_pages || page < 1) {
            throw new BadRequestException('Invalid page number');
        }
        const prev_page = page > 1 ? page - 1 : null
        const next_page = page < total_pages ? page + 1: null;

        return { data, total_pages, prev_page, next_page };
    }

public async activate(dto: string): Promise<IActivateManager> {

      const manager = await this.managerRepository.findOneBy({id: +dto})

if(!manager) {
    throw new NotFoundException('Manager not found')
}
if (manager.is_active){
    throw new HttpException('Manager is active', HttpStatus.BAD_REQUEST)
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

public async recoveryPassword (dto: string) {
     const manager = await this.managerRepository.update(+dto, { is_active: false})
    if(!manager) {
        throw new NotFoundException('Manager not found')
    }
     return await this.activate(dto)
}

public async unbanManager(managerId: string): Promise<ManagerEntity> {
        const manager = await this.managerRepository.findOne({ where: { id: +managerId } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }
        manager.is_banned = false;
        return this.managerRepository.save(manager);
}

public async banManager(managerId: string): Promise<ManagerEntity> {
        const manager = await this.managerRepository.findOne({ where: { id: +managerId } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }
        manager.is_banned = true;
        return this.managerRepository.save(manager);
}
public async isManagerBanned(userId: number): Promise<boolean> {
        const manager = await this.managerRepository.findOne({ where: { id: userId } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }
        return manager.is_banned;
    }
}
