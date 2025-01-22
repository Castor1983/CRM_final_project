import {BadRequestException, Injectable} from '@nestjs/common';
import {OrderRepository} from "../repositories/services/order.repository";
import {PaginationDto} from "./dto/pagination-order.dto";
import {columnsName} from "../../common/constants";
import {OrderPaginationResDto} from "./dto/order-pagination.res.dto";


@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async findAll(paginationDto: PaginationDto): Promise<OrderPaginationResDto> {
    const { page, limit, sort, order } = paginationDto;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    const allowedSortFields = columnsName.orderColumnsName

    if (sort && !allowedSortFields.includes(sort)) {
      throw new BadRequestException(`Invalid sort field: ${sort}`);
    }
    if (sort && order) {
      queryBuilder.orderBy(`order.${sort}`, order);
    }

    queryBuilder.skip((page - 1) * limit).take(limit).orderBy({id: 'DESC'});

    const [data, total] = await queryBuilder.getManyAndCount();
    const total_page = Math.ceil(total/limit)
    const prev_page = page - 1;
    const next_page = page + 1;


    return { data, total_page, prev_page, next_page };
  }

}
