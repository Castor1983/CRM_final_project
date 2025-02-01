import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import {ManagerRepository} from "../modules/repositories/services/manager.repository";


@Injectable()
export class UniqueEmailGuard implements CanActivate {
    constructor(private readonly managerRepository: ManagerRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const managerEmail = request.body.email;

        if (!managerEmail) {
            throw new UnauthorizedException('Manager not authenticated');
        }

        const isUniqueEmail = await this.managerRepository.findOneBy({email: managerEmail});
        if (isUniqueEmail) {
            throw new UnauthorizedException('email is exist');
        }

        return true;
    }
}