import { Column, Entity } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';

@Entity(TableNameEnum.GROUPS)
export class GroupEntity extends CreateUpdateModel {
  @Column('text')
  name: string;
}
