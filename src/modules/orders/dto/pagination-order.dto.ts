import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { CourseEnum } from '../../../database/enums/course.enum';
import { CourseFormatEnum } from '../../../database/enums/courseFormat.enum';
import { CourseTypeEnum } from '../../../database/enums/courseType.enum';
import { DescAscEnum } from '../../../database/enums/desc-asc.enum';
import { OrderColumnsNameEnum } from '../../../database/enums/orderColumnsName.enum';
import { StatusEnum } from '../../../database/enums/status.enum';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;

  @ApiPropertyOptional({
    description: 'Sort by columns name',
    enum: OrderColumnsNameEnum,
  })
  @IsOptional()
  @IsEnum(OrderColumnsNameEnum)
  sort?: OrderColumnsNameEnum;

  @ApiPropertyOptional({ description: 'Filter by course', enum: CourseEnum })
  @IsOptional()
  @IsEnum(CourseEnum)
  course?: CourseEnum;

  @ApiPropertyOptional({
    description: 'Filter by course format',
    enum: CourseFormatEnum,
  })
  @IsOptional()
  @IsEnum(CourseFormatEnum)
  course_format?: CourseFormatEnum;

  @ApiPropertyOptional({
    description: 'Filter by course type',
    enum: CourseTypeEnum,
  })
  @IsOptional()
  @IsEnum(CourseTypeEnum)
  course_type?: CourseTypeEnum;

  @ApiPropertyOptional({ description: 'Filter by status', enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({ description: 'Filter by me', type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  manager?: boolean;

  @ApiPropertyOptional({ description: 'Filter by group', type: String })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiPropertyOptional({ description: 'Filter by name', type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by surname', type: String })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({ description: 'Filter by phone', type: String })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Filter by age', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @ApiPropertyOptional({ description: 'Filter by email', type: String })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'ASC/DESC', enum: DescAscEnum })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Start day', example: '2025-02-01' })
  @IsOptional()
  @IsDateString()
  start_day?: string;

  @ApiPropertyOptional({ description: 'End day', example: '2025-02-10' })
  @IsOptional()
  @IsDateString()
  end_day?: string;
}
