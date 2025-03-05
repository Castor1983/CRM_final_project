import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { OrderPaginationResDto } from './dto/order-pagination.res.dto';
import { PaginationDto } from './dto/pagination-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { COLUMNS_NAME, DESC_ASC } from '../../common/constants';
import { GroupEntity } from '../../database/entities/group.entity';
import { DescAscEnum } from '../../database/enums/desc-asc.enum';
import { StatusEnum } from '../../database/enums/status.enum';
import { IOrderStats } from '../../interfaces/order-stats.interface';
import { CommentRepository } from '../repositories/services/comment.repository';
import { GroupRepository } from '../repositories/services/group.repository';
import { ManagerRepository } from '../repositories/services/manager.repository';
import { OrderRepository } from '../repositories/services/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly commentRepository: CommentRepository,
    private readonly managerRepository: ManagerRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  public async findAll(
    paginationDto: PaginationDto,
    managerId: string,
  ): Promise<OrderPaginationResDto> {
    const { page, limit, sort, order, start_day, end_day, ...filters } =
      paginationDto;
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
        if (['name', 'surname', 'email', 'phone', 'age'].includes(key)) {
          queryBuilder.andWhere(
            `LOWER(order.${key}) LIKE LOWER (:${key}) COLLATE utf8mb4_general_ci`,
            { [key]: `%${value}%` },
          );
        } else if (['manager'].includes(key)) {
          queryBuilder.andWhere('order.manager_id = :managerId', { managerId });
        } else if (key === 'status') {
          if (value === 'New') {
            queryBuilder.andWhere(
              '(order.status = :status OR order.status IS NULL)',
              { status: value },
            );
          } else {
            queryBuilder.andWhere('order.status = :status', { status: value });
          }
        } else {
          queryBuilder.andWhere(`order.${key} = :${key}`, { [key]: value });
        }
      }
    });
    if (start_day) {
      queryBuilder.andWhere('order.created_at >= :start_day', { start_day });
    }
    if (end_day) {
      queryBuilder.andWhere('order.created_at <= :end_day', { end_day });
    }

    if (sort && order) {
      queryBuilder.orderBy(`order.${sort}`, order);
    } else {
      queryBuilder.orderBy({ id: DescAscEnum.DESC });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    if (data.length === 0) {
      return {
        data,
        total_pages: 0,
        prev_page: null,
        next_page: null,
        current_page: page,
      };
    }
    const total_pages = Math.ceil(total / limit);

    if (page > total_pages || page < 1) {
      throw new BadRequestException('Invalid page number');
    }

    const prev_page = page > 1 ? page - 1 : null;
    const next_page = page < total_pages ? page + 1 : null;
    return { data, total_pages, prev_page, next_page, current_page: page };
  }

  public async getOrderStats(): Promise<IOrderStats> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return await queryBuilder
      .select(COLUMNS_NAME.statsColumnsRequest)
      .setParameters({
        new: 'New',
        agree: 'Agree',
        disagree: 'Disagree',
        dubbing: 'Dubbing',
        inWork: 'In work',
      })
      .getRawOne();
  }
  public async getOrderStatsByManager(id: string): Promise<IOrderStats> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return await queryBuilder
      .select(COLUMNS_NAME.statsColumnsRequest)
      .where('order.manager_id = :id', { id })
      .setParameters({
        new: 'New',
        agree: 'Agree',
        disagree: 'Disagree',
        dubbing: 'Dubbing',
        inWork: 'In work',
      })
      .getRawOne();
  }

  public async exportToExcel(
    dto: PaginationDto,
    managerId: string,
  ): Promise<OrderPaginationResDto> {
    const fullDataDto = { ...dto, page: 1, limit: Number.MAX_SAFE_INTEGER };

    return await this.findAll(fullDataDto, managerId);
  }
  public async getOrderById(orderId: string) {
    const orderIdNumber = Number(orderId);
    if (isNaN(orderIdNumber)) {
      throw new BadRequestException('Invalid order ID');
    }
    const order = await this.orderRepository.findOne({
      where: { id: +orderId },
      relations: ['comments'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  public async createComment(
    orderId: string,
    dto: CreateCommentDto,
    managerId: string,
    surname: string,
  ) {
    const orderIdNumber = Number(orderId);
    if (isNaN(orderIdNumber)) {
      throw new BadRequestException('Invalid order ID');
    }
    const order = await this.orderRepository.findOneBy({ id: +orderId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (order.manager === surname || order.manager === null) {
      if (
        (order.manager === null && order.status === null) ||
        order.status === StatusEnum.NEW
      ) {
        await this.orderRepository.update(orderId, {
          manager: surname,
          status: StatusEnum.INWORK,
          manager_: { id: managerId },
        });
      }
      return await this.commentRepository.save(
        this.commentRepository.create({
          ...dto,
          order_id: orderId,
          manager_id: managerId,
          manager_surname: surname,
        }),
      );
    } else {
      throw new BadRequestException('Not enough rights');
    }
  }

  public async updateOrder(
    dto: UpdateOrderDto,
    orderId: string,
    surname: string,
    managerId: string,
  ) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException('No update values provided');
    }

    if (dto.group) {
      const isGroupUnique = await this.groupRepository.findOne({
        where: { name: dto.group },
      });
      if (!isGroupUnique) {
        await this.groupRepository.save({ name: dto.group });
      }
    }
    const order = await this.orderRepository.findOne({
      where: { id: +orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (dto.status === StatusEnum.NEW || dto.status === null) {
      dto = { ...dto, manager: null, manager_: null };
    }
    if (
      order.manager === null &&
      dto.status !== StatusEnum.NEW &&
      dto.status !== null
    ) {
      await this.orderRepository.update(order.id, {
        ...dto,
        manager: surname,
        manager_: { id: managerId },
      });
    } else if (order.manager === surname || order.manager === null) {
      await this.orderRepository.update(order.id, dto);
    } else {
      throw new BadRequestException('Not enough rights');
    }
    return this.orderRepository.findOne({ where: { id: order.id } });
  }

  public async getAllGroups(): Promise<GroupEntity[]> {
    const groups = await this.groupRepository.find({
      select: { id: true, name: true },
    });
    if (!groups || groups.length === 0) {
      throw new BadRequestException('Groups not found');
    }
    return groups;
  }
  public async createGroup(dto: CreateGroupDto): Promise<void> {
    const groupExist = await this.groupRepository.findOne({
      where: { name: dto.name },
    });
    if (groupExist) {
      throw new BadRequestException('Group is exist');
    }
    await this.groupRepository.save(dto);
  }
}
