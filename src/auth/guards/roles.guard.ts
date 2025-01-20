import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!role) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if(!user || !user.role) {
            return false;
        }

        return role === user.role;
    }
}