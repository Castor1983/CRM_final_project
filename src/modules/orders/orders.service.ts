import {BadRequestException, Injectable} from '@nestjs/common';
import {OrderRepository} from "../repositories/services/order.repository";
import {PaginationDto} from "./dto/pagination-order.dto";
import {COLUMNS_NAME, DESC_ASC} from "../../common/constants";
import {OrderPaginationResDto} from "./dto/order-pagination.res.dto";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";
import {IOrderStats} from "../../interfaces/order-stats.interface";

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

  public async getOrderStats(): Promise<IOrderStats> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    const stats = await queryBuilder
        .select([
          'COUNT(order.id) AS total',
          /*`SUM(CASE WHEN order.status = :in work THEN 1 ELSE 0 END) AS in_work`,
          `SUM(CASE WHEN order.status = :new THEN 1 ELSE 0 END) AS new`,*/
          'SUM(CASE WHEN order.status = :agree THEN 1 ELSE 0 END) AS agree',
          'SUM(CASE WHEN order.status = :disagree THEN 1 ELSE 0 END) AS disagree',
          'SUM(CASE WHEN order.status = :dubbing THEN 1 ELSE 0 END) AS dubbing',
          'SUM(CASE WHEN order.status IS NULL THEN 1 ELSE 0 END) AS null_count'
        ])
        .setParameters( {/*inWork: 'In work', newStatus: 'New',*/ agree: 'Agree', disagree: 'Disagree',  dubbing: 'Dubbing' } )
        .getRawOne();

    return {
      total: Number(stats.total),
     /* in_work: Number(stats.in_work),
      new: Number(stats.new),*/
      agree: Number(stats.agree),
      disagree: Number(stats.disagree),
      dubbing: Number(stats.dubbing),
      null_count: Number(stats.null_count)
    };
  }
}
