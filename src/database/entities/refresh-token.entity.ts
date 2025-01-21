import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model'
import { ManagerEntity } from './manager.entity';

// @Index(['refreshToken', 'deviceId'])
@Entity(TableNameEnum.REFRESH_TOKENS)
export class RefreshTokenEntity extends CreateUpdateModel {
  @Column('text')
  refreshToken: string;

  @Index()
  @Column('text')
  deviceId: string;

  @Column()
  manager_id: string;
  @ManyToOne(() => ManagerEntity, (entity) => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manager_id' })
  manager?: ManagerEntity;
}
