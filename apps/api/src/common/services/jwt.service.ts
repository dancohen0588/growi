import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(
    private nestJwtService: NestJwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Génère les tokens d'accès et de refresh
   */
  async generateTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<JwtTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Génère un access token JWT
   */
  private async generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });
  }

  /**
   * Génère un refresh token (random)
   */
  private async generateRefreshToken(): Promise<string> {
    return randomBytes(64).toString('hex');
  }

  /**
   * Vérifie et decode un access token
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.nestJwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  /**
   * Hash un refresh token pour stockage sécurisé
   */
  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Calcule la date d'expiration du refresh token
   */
  getRefreshTokenExpiry(): Date {
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
    const now = new Date();
    
    // Parse la durée (ex: "7d", "24h", "60m")
    const match = expiresIn.match(/^(\d+)([dhm])$/);
    if (!match) {
      throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 'd':
        return new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + numValue * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() + numValue * 60 * 1000);
      default:
        throw new Error('Invalid JWT_REFRESH_EXPIRES_IN unit');
    }
  }

  /**
   * Extrait le token Bearer de l'header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}