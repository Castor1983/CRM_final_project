import { Injectable } from "@nestjs/common";
import { ManagerEntity } from "src/database/entities/manager.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ManagerRepository extends Repository<ManagerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ManagerEntity, dataSource.manager);
  }
}
