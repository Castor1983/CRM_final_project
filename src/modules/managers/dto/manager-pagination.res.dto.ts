
import {ManagerEntity} from "../../../database/entities/manager.entity";
import {IOrderStats} from "../../../interfaces/order-stats.interface";


export class ManagerPaginationResDto {
orderStats: IOrderStats;
data: ManagerEntity[];
total_pages: number;
prev_page: number;
next_page: number;
}