import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CourseEnum } from '../enums/course.enum';
import { CourseFormatEnum } from '../enums/courseFormat.enum';
import { CourseTypeEnum } from '../enums/courseType.enum';
import { StatusEnum } from '../enums/status.enum';
import {TableNameEnum} from "../enums/table-name.enum";

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

  @Column({ type: 'enum', enum: CourseEnum, nullable: true, default: null })
  course: CourseEnum;

  @Column({ type: 'enum', enum: CourseFormatEnum, nullable: true, default: null })
  course_format: CourseFormatEnum;

  @Column({ type: 'enum', enum: CourseTypeEnum, nullable: true, default: null })
  course_type: CourseTypeEnum;

  @Column({ type: 'enum', enum: StatusEnum, nullable: true, default: null })
  status: StatusEnum;

  @Column('int', {nullable: true, default: null})
  sum: number;

  @Column('int', {nullable: true, default: null})
  alreadyPaid: number;

  @Column('varchar', { length: 100, nullable: true, default: null })
  msg: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  utm: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  manager: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  group: string;

  @CreateDateColumn({nullable: true, default: null})
  created_at: Date;
}
