import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from 'src/database/entities/order.entity';
import {OrderRepository} from "../repositories/services/order.repository";

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
