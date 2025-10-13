import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminToken = this.configService.get('ADMIN_TOKEN');
    
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token d\'administration requis');
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (token !== adminToken) {
      throw new UnauthorizedException('Token d\'administration invalide');
    }

    return true;
  }
}