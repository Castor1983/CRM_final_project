import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { TableNameEnum } from "../enums/table-name.enum";

import { ManagerEntity } from "./manager.entity";
import { OrderEntity } from "./order.entity";
import { CreateUpdateModel } from "../models/create-update.model";

@Entity(TableNameEnum.COMMENTS)
export class CommentEntity extends CreateUpdateModel {
  @Column("text")
  body: string;

  @Column("text")
  manager_surname: string;

  @Column()
  manager_id: string;
  @ManyToOne(() => ManagerEntity, (entity) => entity.comments)
  @JoinColumn({ name: "manager_id" })
  manager?: ManagerEntity;

  @Column()
  order_id: string;
  @ManyToOne(() => OrderEntity, (entity) => entity.comments)
  @JoinColumn({ name: "order_id" })
  order?: OrderEntity;
}
