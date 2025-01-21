import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model'
import { ManagerEntity } from './manager.entity';

//@Index(['refreshToken', 'deviceId'], {unique: true})
@Entity(TableNameEnum.REFRESH_TOKENS)
export class RefreshTokenEntity extends CreateUpdateModel {

  @Column('varchar')
  refreshToken: string;

  @Column('varchar', {length: 255})
  deviceId: string;

  @Column()
  managerId: string;
  @ManyToOne(() => ManagerEntity, (entity) => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manager_id' })
  manager?: ManagerEntity;
}
