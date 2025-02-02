import { PartialType, PickType } from '@nestjs/mapped-types';

import {IsInt, IsOptional} from "class-validator";
import {OrderEntity} from "../../../database/entities/order.entity";

export class UpdateOrderDto extends PartialType(
    PickType(OrderEntity, [
        'course',
        'course_format',
        'course_type',
        'status',
        'group',
        'name',
        'surname',
        'phone',
        'age',
        'email',
    ]),
) {
    @IsOptional()
    @IsInt()
    sum?: number;

    @IsOptional()
    @IsInt()
    alreadyPaid?: number;
}