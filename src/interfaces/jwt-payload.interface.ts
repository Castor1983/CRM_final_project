import {ManagerRole} from "../database/enums/managerRole.enum";

export interface IJwtPayload {
  managerId: string;
  surname: string;
  role: ManagerRole;
}
