import { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import {ManagerEntity} from "../../database/entities/manager.entity";
import {IManagerData} from "../../interfaces/manager-data.interface";
import {ManagerRole} from "../../database/enums/managerRole.enum";


export class ManagerMapper {

  public static toIManagerData(manager: ManagerEntity, payload: IJwtPayload): IManagerData {
    return {
      managerId: payload.managerId,
      deviceId: payload.deviceId,
      email: manager.email,
      role: ManagerRole.MANAGER
    };
  }
}
