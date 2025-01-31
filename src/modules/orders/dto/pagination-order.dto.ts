import {IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsString, Min} from 'class-validator';
import { Type } from 'class-transformer';
import {OrderColumnsNameEnum} from "../../../database/enums/orderColumnsName.enum";
import {CourseEnum} from "../../../database/enums/course.enum";
import {CourseFormatEnum} from "../../../database/enums/courseFormat.enum";
import {CourseTypeEnum} from "../../../database/enums/courseType.enum";
import {StatusEnum} from "../../../database/enums/status.enum";


export class PaginationDto {
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

    @IsOptional()
    @IsEnum(OrderColumnsNameEnum)
    sort?: OrderColumnsNameEnum;

    @IsOptional()
    @IsEnum(CourseEnum)
    course?: CourseEnum;

    @IsOptional()
    @IsEnum(CourseFormatEnum)
    course_format?: CourseFormatEnum;

    @IsOptional()
    @IsEnum(CourseTypeEnum)
    course_type?: CourseTypeEnum;

    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;

    @IsOptional()
    @IsBoolean()
    manager?: boolean

    @IsOptional()
    @IsString()
    group?: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    surname?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    age?: number

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}