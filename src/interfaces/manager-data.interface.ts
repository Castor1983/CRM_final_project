import {ManagerRole} from "../database/enums/managerRole.enum";

export interface IManagerData {
  managerId: string;
  email: string;
  role: ManagerRole;
}
