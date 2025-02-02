import { PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationDto } from './pagination-order.dto';
import {IsInt, IsOptional} from "class-validator";

export class UpdateOrderDto extends PartialType(
    PickType(PaginationDto, ['course', 'course_format', 'course_type', 'status', 'group', 'name', 'surname',  'phone', 'age', 'email'])
) {
    @IsOptional()
    @IsInt()
    sum?: number

    @IsOptional()
    @IsInt()
    alreadyPaid?: number
}