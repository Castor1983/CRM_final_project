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

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('varchar', { unique: true, length: 255 })
  email: string;

  @Column('text')
  phone: string;

  @Column('int')
  age: number;

  @Column({ type: 'enum', enum: CourseEnum })
  course: CourseEnum;

  @Column({ type: 'enum', enum: CourseFormatEnum })
  course_format: CourseFormatEnum;

  @Column({ type: 'enum', enum: CourseTypeEnum })
  course_type: CourseTypeEnum;

  @Column({ type: 'enum', enum: StatusEnum })
  status: StatusEnum;

  @Column('int')
  sum: number;

  @Column('int')
  alreadyPaid: number;

  @Column('text')
  group: string;

  @Column('text')
  manager: string;

  @CreateDateColumn()
  created_at: Date;
}
