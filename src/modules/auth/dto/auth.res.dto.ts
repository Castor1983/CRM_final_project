import { ManagerResDto } from '../../managers/dto/manager.res.dto';

export class AuthResDto {
  accessToken: string;
  manager: ManagerResDto;
}
