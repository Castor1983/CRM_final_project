import { PartialType} from '@nestjs/mapped-types';

import {IsInt, IsOptional, IsString} from "class-validator";
import {OrderEntity} from "../../../database/entities/order.entity";
import {CourseEnum} from "../../../database/enums/course.enum";
import {CourseFormatEnum} from "../../../database/enums/courseFormat.enum";
import {CourseTypeEnum} from "../../../database/enums/courseType.enum";
import {StatusEnum} from "../../../database/enums/status.enum";

export class UpdateOrderDto extends PartialType(OrderEntity) {
    @IsOptional()
    @IsString()
    course?: CourseEnum;

    @IsOptional()
    @IsString()
    course_format?: CourseFormatEnum;

    @IsOptional()
    @IsString()
    course_type?: CourseTypeEnum;

    @IsOptional()
    @IsString()
    status?: StatusEnum;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    surname?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsInt()
    sum?: number;

    @IsOptional()
    @IsInt()
    alreadyPaid?: number;
}