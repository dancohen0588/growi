import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException('Authentification requise');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Droits administrateur requis');
    }

    return true;
  }
}