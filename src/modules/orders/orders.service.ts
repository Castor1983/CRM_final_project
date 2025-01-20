import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from '../repository/services/order.repository';
import { OrderEntity } from 'src/database/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  public async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find();
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
