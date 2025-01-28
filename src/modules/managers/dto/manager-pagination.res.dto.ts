
import {ManagerEntity} from "../../../database/entities/manager.entity";

export class ManagerPaginationResDto {
data: ManagerEntity[];
total_pages: number;
prev_page: number;
next_page: number;
}