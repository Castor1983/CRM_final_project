import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ManagerReqDto } from './dto/create-manager.dto';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { ManagerRepository } from '../repositories/services/manager.repository';

@Injectable()
export class ManagersService {
  constructor(private readonly managerRepository: ManagerRepository) {}
  public async create(dto: ManagerReqDto): Promise<ManagerEntity> {
    const password = await bcrypt.hash(dto.password, 10);
    return await this.managerRepository.save({ ...dto, password });
  }

}
