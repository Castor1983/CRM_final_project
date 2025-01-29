import {BadRequestException, Injectable} from '@nestjs/common';
import {OrderRepository} from "../repositories/services/order.repository";
import {PaginationDto} from "./dto/pagination-order.dto";
import {COLUMNS_NAME, DESC_ASC} from "../../common/constants";
import {OrderPaginationResDto} from "./dto/order-pagination.res.dto";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async findAll(paginationDto: PaginationDto): Promise<OrderPaginationResDto> {
    const { page, limit, sort, order } = paginationDto;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
  const allowedSortFields = COLUMNS_NAME.orderColumnsName
    const allowedOrderFields = DESC_ASC

    if (sort && !allowedSortFields.includes(sort)) {
      throw new BadRequestException(`Invalid sort field: ${sort}`);
    }
    if (order&& !allowedOrderFields.includes(order)){
      throw new BadRequestException(`Invalid order field: ${order}`);
    }

    if (sort && order) {
      queryBuilder.orderBy(`order.${sort}`, order);
    }else {
      queryBuilder.orderBy({id: DescAscEnum.DESC})
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    console.log(data)
    if(!data || data.length === 0) {
      throw new BadRequestException ( 'Orders not found')
    }
    const total_pages = Math.ceil(total/limit)
    if (page > total_pages || page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    const prev_page = page > 1 ? page - 1 : null
    const next_page = page < total_pages ? page + 1: null;

    return { data, total_pages, prev_page, next_page };
  }
}
