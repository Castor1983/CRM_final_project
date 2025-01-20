import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ManagerReqDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { ManagerRepository } from '../repository/services/manager.repository';

@Injectable()
export class ManagersService {
  constructor(private readonly managerRepository: ManagerRepository) {}
  public async create(dto: ManagerReqDto): Promise<ManagerEntity> {
    const password = await bcrypt.hash(dto.password, 10);
    return await this.managerRepository.save({ ...dto, password });
  }

  findAll() {
    return `This action returns all managers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return `This action updates a #${id} manager`;
  }

  public async remove(id: number) {
    await this.managerRepository.delete(id);
  }
}
