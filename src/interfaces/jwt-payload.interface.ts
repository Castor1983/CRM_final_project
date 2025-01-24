import {ManagerRole} from "../database/enums/managerRole.enum";

export interface IJwtPayload {
  managerId: string;
  role: ManagerRole
}
