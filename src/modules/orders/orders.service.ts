import * as ExcelJS from 'exceljs';
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';

import {OrderRepository} from "../repositories/services/order.repository";
import {PaginationDto} from "./dto/pagination-order.dto";
import {COLUMNS_NAME, DESC_ASC} from "../../common/constants";
import {OrderPaginationResDto} from "./dto/order-pagination.res.dto";
import {DescAscEnum} from "../../database/enums/desc-asc.enum";
import {IOrderStats} from "../../interfaces/order-stats.interface";
import {CommentRepository} from "../repositories/services/comment.repository";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {StatusEnum} from "../../database/enums/status.enum";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {DeepPartial} from "typeorm";
import {OrderEntity} from "../../database/entities/order.entity";


@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository,
              private readonly commentRepository: CommentRepository) {}

  public async findAll(paginationDto: PaginationDto, managerId: string): Promise<OrderPaginationResDto> {
    const { page, limit, sort, order, ...filters } = paginationDto;
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    const allowedSortFields = COLUMNS_NAME.orderColumnsName;
    const allowedOrderFields = DESC_ASC;

    if (sort && !allowedSortFields.includes(sort)) {
      throw new BadRequestException(`Invalid sort field: ${sort}`);
    }
    if (order && !allowedOrderFields.includes(order)) {
      throw new BadRequestException(`Invalid order field: ${order}`);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== false) {
        if (['name', 'surname', 'email', 'phone', 'group'].includes(key)) {
          queryBuilder.andWhere(`order.${key} LIKE :${key}`, { [key]: `%${value}%` });
        } else if (['manager'].includes(key)){
          queryBuilder.andWhere('order.manager_id = :managerId', { managerId});
        } else {
          queryBuilder.andWhere(`order.${key} = :${key}`, { [key]: value });
        }
      }
    });

    if (sort && order) {
      queryBuilder.orderBy(`order.${sort}`, order);
    } else {
      queryBuilder.orderBy({ id: DescAscEnum.DESC });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    if (!data || data.length === 0) {
      throw new BadRequestException('Orders not found');
    }

    const total_pages = Math.ceil(total / limit);

    if (page > total_pages || page < 1) {
      throw new BadRequestException('Invalid page number');
    }

    const prev_page = page > 1 ? page - 1 : null;
    const next_page = page < total_pages ? page + 1 : null;

    return { data, total_pages, prev_page, next_page };
  }

  public async getOrderStats(): Promise<IOrderStats> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return await queryBuilder
        .select(COLUMNS_NAME.statsColumnsRequest)
        .setParameters( { new: 'New', agree: 'Agree', disagree: 'Disagree',  dubbing: 'Dubbing', inWork: 'In work', } )
        .getRawOne();
  }

  public async exportToExcel(dto: PaginationDto, managerId: string): Promise<Buffer> {

    const orders = await this.findAll(dto, managerId);

    if (!orders.data.length) {
      throw new BadRequestException('No orders found for export');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = COLUMNS_NAME.orderExcelColumns;

    orders.data.forEach((order) => {
      worksheet.addRow(order);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
  public async getOrderById (orderId: string) {
    const orderIdNumber = Number(orderId);
    if (isNaN(orderIdNumber)) {
      throw new BadRequestException('Invalid order ID');
    }
    const order = await this.orderRepository.findOne({ where: {id: +orderId}, relations: ['comments'] })
    if (!order) {
      throw new BadRequestException('Order not found')
    }
    return order

  }

  public async createComment (orderId: string, dto: CreateCommentDto, managerId: string, surname: string) {
    const orderIdNumber = Number(orderId);
    if (isNaN(orderIdNumber)) {
      throw new BadRequestException('Invalid order ID');
    }
    const order = await this.orderRepository.findOneBy({id: +orderId})
    if (!order) {
      throw new BadRequestException('Order not found')
    } if (order.manager === surname || order.manager === null) {
          if(order.manager === null && order.status === null || order.status === StatusEnum.NEW) {
            await this.orderRepository.update(orderId, {manager: surname, status: StatusEnum.INWORK})
          }
      return await this.commentRepository.save(this.commentRepository.create({
        ...dto,
        order_id: orderId,
        manager_id: managerId,
        manager_surname: surname
      }))
    }else {
      throw new BadRequestException ('Not enough rights')
    } }

  public async updateOrder ( dto: UpdateOrderDto, orderId: string){
    const order = await this.orderRepository.findOne({ where: { id: +orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.update(order.id, dto);
    return this.orderRepository.findOne({ where: { id: order.id } });
  }
}
