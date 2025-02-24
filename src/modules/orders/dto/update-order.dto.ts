import { PartialType } from "@nestjs/mapped-types";

import { IsEnum, IsInt, IsOptional, IsString, Matches } from "class-validator";
import { OrderEntity } from "../../../database/entities/order.entity";
import { CourseEnum } from "../../../database/enums/course.enum";
import { CourseFormatEnum } from "../../../database/enums/courseFormat.enum";
import { CourseTypeEnum } from "../../../database/enums/courseType.enum";
import { StatusEnum } from "../../../database/enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto extends PartialType(OrderEntity) {
  @ApiProperty({ required: false, enum: CourseEnum })
  @IsOptional()
  @IsEnum(CourseEnum)
  course?: CourseEnum;

  @ApiProperty({ required: false, enum: CourseFormatEnum })
  @IsOptional()
  @IsEnum(CourseFormatEnum)
  course_format?: CourseFormatEnum;

  @ApiProperty({ required: false, enum: CourseTypeEnum })
  @IsOptional()
  @IsEnum(CourseTypeEnum)
  course_type?: CourseTypeEnum;

  @ApiProperty({ required: false, enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^0\d{9}$/, { message: "Phone is not correct" })
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sum?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  alreadyPaid?: number;
}
