import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommentEntity } from './comment.entity';
import { ManagerEntity } from './manager.entity';
import { TableNameEnum } from '../enums/table-name.enum';

@Entity(TableNameEnum.ORDERS)
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 25, nullable: true, default: null })
  name: string;

  @Column('varchar', { length: 25, nullable: true, default: null })
  surname: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  email: string;

  @Column('varchar', { length: 10, nullable: true, default: null })
  phone: string;

  @Column('int', { nullable: true, default: null })
  age: number;

  @Column('varchar', { length: 10, nullable: true, default: null })
  course: string;

  @Column('varchar', { length: 15, nullable: true, default: null })
  course_format: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  course_type: string;

  @Column('varchar', { length: 15, nullable: true, default: null })
  status: string;

  @Column('int', { nullable: true, default: null })
  sum: number;

  @Column('int', { nullable: true, default: null })
  alreadyPaid: number;

  @Column('varchar', { length: 100, nullable: true, default: null })
  msg: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  utm: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  manager: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  group: string;

  @CreateDateColumn({ nullable: true, default: null })
  created_at: Date;
  @ManyToOne(() => ManagerEntity, manager => manager.orders, {
    onDelete: 'SET NULL',
  })
  manager_: ManagerEntity;
  @OneToMany(() => CommentEntity, entity => entity.order)
  comments?: CommentEntity[];
}
