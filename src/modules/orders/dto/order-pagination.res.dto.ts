import {OrderEntity} from "../../../database/entities/order.entity";

export class OrderPaginationResDto {
data: OrderEntity[];
total_pages: number;
prev_page: number;
next_page: number;
}