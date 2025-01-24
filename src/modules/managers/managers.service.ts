import { Injectable } from '@nestjs/common';

import { ManagerEntity } from 'src/database/entities/manager.entity';
import { ManagerRepository } from '../repositories/services/manager.repository';
import {ManagerCreateDto} from "./dto/create-manager.dto";

@Injectable()
export class ManagersService {
  constructor(private readonly managerRepository: ManagerRepository) {}
  public async create(dto: ManagerCreateDto): Promise<ManagerEntity> {

    return await this.managerRepository.save(dto);
  }

}
