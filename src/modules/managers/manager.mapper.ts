import { ManagerEntity } from '../../database/entities/manager.entity';
import { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import { IManagerData } from '../../interfaces/manager-data.interface';

export class ManagerMapper {
  public static toIManagerData(
    manager: ManagerEntity,
    payload: IJwtPayload,
  ): IManagerData {
    return {
      managerId: payload.managerId,
      email: manager.email,
      role: manager.role,
      surname: manager.surname,
    };
  }
}
