import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

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
import {DescAscEnum} from "../../database/enums/desc-asc.enum";
import {ManagerPaginationResDto} from "./dto/manager-pagination.res.dto";
import {OrdersService} from "../orders/orders.service";
import {ManagerRole} from "../../database/enums/managerRole.enum";


@Injectable()
export class ManagersService {
    private readonly appConfig: AppConfig;
  constructor(
      private readonly managerRepository: ManagerRepository,
      private readonly  tokenService: TokenService,
      private readonly ordersService: OrdersService,
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
    public async getAll(): Promise<ManagerPaginationResDto> {


        const queryBuilder = this.managerRepository.createQueryBuilder('manager');

            queryBuilder.orderBy({id: DescAscEnum.DESC})

        const managers  = await queryBuilder.getMany();
        const orderStats = await this.ordersService.getOrderStats()
        const managersWithStats = await Promise.all(
            managers.map(async (manager) => {
                const orderStats = await this.ordersService.getOrderStatsByManager(manager.id);
                return { ...manager, orderStats };
            })
        );



        return { orderStats,  data: managersWithStats };
    }

public async activate(dto: string): Promise<IActivateManager> {

      const manager = await this.managerRepository.findOneBy({id: dto})

if(!manager) {
    throw new NotFoundException('Manager not found')
}
if (manager.is_active){
    throw new HttpException('Manager is active', HttpStatus.BAD_REQUEST)
}

const payload = {managerId: manager.id.toString(), role: manager.role}
    const {activateToken} = await this.tokenService.generateActivateToken(payload);

    const activationLink = `http://${this.appConfig.host}:${this.appConfig.port}/managers/activate/${activateToken}`;

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
           await this.managerRepository.update(payload.managerId, {password: hashPassword, is_active: true})
      } else {
          throw new BadRequestException ('Password and password confirmation do not match')
      }
      return { message: 'Password create is successful'}
}

public async recoveryPassword (dto: string) {
     const manager = await this.managerRepository.update(dto, { is_active: false})
    if(!manager) {
        throw new NotFoundException('Manager not found')
    }
     return await this.activate(dto)
}

public async unbanManager(managerId: string): Promise<ManagerEntity> {
        const manager = await this.managerRepository.findOne({ where: { id: managerId } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }
    if(manager.role === ManagerRole.ADMIN) {
        throw new BadRequestException ('Admin can not banned or unbanned')
    }
        manager.is_banned = false;
        return this.managerRepository.save(manager);
}

public async banManager(managerId: string): Promise<ManagerEntity> {
        const manager = await this.managerRepository.findOne({ where: { id: managerId } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }
        if(manager.role === ManagerRole.ADMIN) {
            throw new BadRequestException ('Admin can not banned')
        }
        manager.is_banned = true;
        return this.managerRepository.save(manager);
}
public async isManagerBanned(managerEmail: string): Promise<boolean> {
        const manager = await this.managerRepository.findOne({ where: { email: managerEmail } });
        if (!manager) {
            throw new NotFoundException('User not found');
        }

        return manager.is_banned;
    }
}
