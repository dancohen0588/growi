import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../../common/services/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
    
    this.logger.log(`[JWT_STRATEGY] Initialized with secret: ${configService.get('JWT_SECRET') ? '✅ SET' : '❌ NOT SET'}`);
  }

  /**
   * Valide le payload JWT et retourne l'utilisateur
   * Cette méthode est appelée automatiquement par Passport
   */
  async validate(payload: JwtPayload) {
    this.logger.log(`[JWT_STRATEGY] Validating payload: ${JSON.stringify(payload)}`);
    
    const { sub: userId, email, role } = payload;

    // Vérifier que l'utilisateur existe toujours et est actif
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
      },
    });

    this.logger.log(`[JWT_STRATEGY] User found: ${user ? '✅ YES' : '❌ NO'}`);
    
    if (!user) {
      this.logger.error(`[JWT_STRATEGY] User not found for userId: ${userId}`);
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    this.logger.log(`[JWT_STRATEGY] User status: ${user.status}`);
    
    if (user.status !== 'ACTIVE') {
      this.logger.error(`[JWT_STRATEGY] Inactive user status: ${user.status}`);
      throw new UnauthorizedException('Compte utilisateur inactif');
    }

    this.logger.log(`[JWT_STRATEGY] ✅ Validation successful for user: ${user.email}`);

    // Retourner l'utilisateur qui sera attaché à req.user
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}