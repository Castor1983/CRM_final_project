import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ManagersService } from '../modules/managers/managers.service';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(private readonly managersService: ManagersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const manager = request.body.email;

    if (!manager) {
      throw new UnauthorizedException('Manager not authenticated');
    }

    const isBanned = await this.managersService.isManagerBanned(manager);
    if (isBanned) {
      throw new UnauthorizedException('Manager is banned');
    }

    return true;
  }
}
