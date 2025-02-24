import { Injectable } from "@nestjs/common";
import { OrderEntity } from "src/database/entities/order.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderEntity, dataSource.manager);
  }
}
