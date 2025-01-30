import {IsIn, IsInt,  IsOptional, IsString, Min} from 'class-validator';
import { Type } from 'class-transformer';
import {OrderColumnsNameEnum} from "../../../database/enums/orderColumnsName.enum";


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
    @IsString()
    sort?: OrderColumnsNameEnum;

   /* @IsOptional()
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
    email?: string*/

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}