import {IsIn, IsInt, IsOptional, IsString, Min} from 'class-validator';
import { Type } from 'class-transformer';
import {OrderColumnsNameEnum} from "../../../database/enums/orderColumnsName.enum";
import {DescAscEnum} from "../../../database/enums/desc-asc.enum";

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

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}