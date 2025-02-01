import * as ExcelJS from 'exceljs';
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
    console.log(filters.manager, managerId)

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

    const stats = await queryBuilder
        .select([
          'COUNT(order.id) AS total',
          `SUM(CASE WHEN order.status = :inWork THEN 1 ELSE 0 END) AS in_work`,
          `SUM(CASE WHEN order.status = :new THEN 1 ELSE 0 END) AS new`,
          'SUM(CASE WHEN order.status = :agree THEN 1 ELSE 0 END) AS agree',
          'SUM(CASE WHEN order.status = :disagree THEN 1 ELSE 0 END) AS disagree',
          'SUM(CASE WHEN order.status = :dubbing THEN 1 ELSE 0 END) AS dubbing',
          'SUM(CASE WHEN order.status IS NULL THEN 1 ELSE 0 END) AS null_count'
        ])
        .setParameters( { new: 'New', agree: 'Agree', disagree: 'Disagree',  dubbing: 'Dubbing', inWork: 'In work', } )
        .getRawOne();

    return {
      total: Number(stats.total),
      in_work: Number(stats.in_work),
      new: Number(stats.new),
      agree: Number(stats.agree),
      disagree: Number(stats.disagree),
      dubbing: Number(stats.dubbing),
      null_count: Number(stats.null_count)
    };
  }

  public async exportToExcel(dto: PaginationDto, managerId: string): Promise<Buffer> {

    const orders = await this.findAll(dto, managerId);

    if (!orders.data.length) {
      throw new BadRequestException('No orders found for export');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Surname', key: 'surname', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Age', key: 'age', width: 15 },
      { header: 'Format', key: 'course_format', width: 15 },
      { header: 'Type', key: 'course_type', width: 15 },
      { header: 'Sum', key: 'sum', width: 15 },
      { header: 'Already paid', key: 'alreadyPaid', width: 15 },
      { header: 'Create', key: 'create_at', width: 15 },
      { header: 'Utm', key: 'utm', width: 15 },
      { header: 'Msg', key: 'msg', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Group', key: 'group', width: 15 },
      { header: 'Manager', key: 'manager', width: 15 },
    ];

    orders.data.forEach((order) => {
      worksheet.addRow(order);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
