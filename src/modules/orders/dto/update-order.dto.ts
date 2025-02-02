import { PartialType} from '@nestjs/mapped-types';

import {IsEnum, IsInt, IsOptional, IsString} from "class-validator";
import {OrderEntity} from "../../../database/entities/order.entity";
import {CourseEnum} from "../../../database/enums/course.enum";
import {CourseFormatEnum} from "../../../database/enums/courseFormat.enum";
import {CourseTypeEnum} from "../../../database/enums/courseType.enum";
import {StatusEnum} from "../../../database/enums/status.enum";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateOrderDto extends PartialType(OrderEntity) {
    @ApiProperty()
    @IsOptional()
    @IsEnum(CourseEnum)
    course?: CourseEnum;

    @ApiProperty()
    @IsOptional()
    @IsEnum(CourseFormatEnum)
    course_format?: CourseFormatEnum;

    @ApiProperty()
    @IsOptional()
    @IsEnum(CourseTypeEnum)
    course_type?: CourseTypeEnum;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;

    @ApiProperty()
    @IsOptional()
    @IsString()
    group?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    surname?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    age?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    sum?: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    alreadyPaid?: number;
}