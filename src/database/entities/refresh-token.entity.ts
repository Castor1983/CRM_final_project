import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ManagerEntity } from './manager.entity';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';

@Entity(TableNameEnum.REFRESH_TOKENS)
export class RefreshTokenEntity extends CreateUpdateModel {
  @Column('varchar')
  refreshToken: string;
  @Column()
  managerId: string;
  @ManyToOne(() => ManagerEntity, entity => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manager_id' })
  manager?: ManagerEntity;
}
