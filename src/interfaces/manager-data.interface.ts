import {ManagerRole} from "../database/enums/managerRole.enum";

export interface IManagerData {
  managerId: string;
  deviceId: string;
  email: string;
  role: ManagerRole;
}
