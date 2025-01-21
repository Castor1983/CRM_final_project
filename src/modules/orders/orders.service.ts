import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from 'src/database/entities/order.entity';
import {OrderRepository} from "../repositories/services/order.repository";
import {PaginationDto} from "./dto/pagination-order.dto";
import {columnsName} from "../../common/constants";


@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  public async findAll(paginationDto: PaginationDto): Promise<{ data: OrderEntity[]; total: number }> {
    const { page, limit, sort, order } = paginationDto;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    const allowedSortFields = columnsName.orderColumnsName
    if (sort && !allowedSortFields.includes(sort)) {
      throw new BadRequestException(`Invalid sort field: ${sort}`);
    }
    if (sort && order) {
      queryBuilder.orderBy(`order.${sort}`, order);
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
