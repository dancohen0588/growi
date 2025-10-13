import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '../common/services/jwt.service';
import { PasswordService } from '../common/services/password.service';
import { MailService } from '../common/services/mail.service';
import { RateLimitService } from '../common/services/rate-limit.service';
import { RegisterDto, LoginDto, RequestPasswordResetDto, ResetPasswordDto } from './dto/auth.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private mailService: MailService,
    private rateLimitService: RateLimitService,
    private configService: ConfigService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email');
    }

    // Valider le mot de passe
    const passwordValidation = this.passwordService.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        error: 'Mot de passe invalide',
        details: passwordValidation.errors,
      });
    }

    // Hasher le mot de passe
    const passwordHash = await this.passwordService.hashPassword(password);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Générer les tokens
    const tokens = await this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Stocker le refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Envoyer l'email de bienvenue en arrière-plan
    this.rateLimitService.addBackgroundTask('send_welcome_email', {
      email: user.email,
      firstName: user.firstName,
    }).catch(err => {
      this.logger.error('Failed to schedule welcome email:', err);
    });

    this.logger.log(`Nouvel utilisateur inscrit: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens,
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(loginDto: LoginDto, clientIp: string) {
    const { email, password } = loginDto;

    // Vérifier le rate limiting
    const rateLimit = await this.rateLimitService.checkRateLimit(clientIp, 'login');
    if (!rateLimit.allowed) {
      throw new UnauthorizedException({
        error: 'Trop de tentatives de connexion',
        resetTime: rateLimit.resetTime,
      });
    }

    // Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le statut de l'utilisateur
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Votre compte a été suspendu');
    }

    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('Votre compte est en attente de validation');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await this.passwordService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Reset rate limit après connexion réussie
    await this.rateLimitService.resetRateLimit(clientIp, 'login');

    // Révoquer les anciens refresh tokens (optionnel, pour sécurité renforcée)
    await this.revokeUserRefreshTokens(user.id);

    // Générer de nouveaux tokens
    const tokens = await this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Stocker le nouveau refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`Connexion réussie: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens,
    };
  }

  /**
   * Refresh des tokens
   */
  async refreshTokens(refreshToken: string) {
    const tokenHash = this.jwtService.hashRefreshToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    // Vérifier le statut de l'utilisateur
    if (storedToken.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Utilisateur inactif');
    }

    // Révoquer l'ancien token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Générer de nouveaux tokens
    const newTokens = await this.jwtService.generateTokens({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Stocker le nouveau refresh token
    await this.storeRefreshToken(storedToken.user.id, newTokens.refreshToken);

    return { tokens: newTokens };
  }

  /**
   * Déconnexion (révocation du refresh token)
   */
  async logout(refreshToken: string) {
    const tokenHash = this.jwtService.hashRefreshToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revoked: false },
      data: { revoked: true },
    });

    this.logger.log('Déconnexion effectuée');
  }

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      user: {
        ...user,
        emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
        createdAt: user.createdAt.toISOString(),
      }
    };
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  async requestPasswordReset(requestDto: RequestPasswordResetDto) {
    const { email } = requestDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Ne pas révéler si l'utilisateur existe ou non
    if (!user) {
      this.logger.warn(`Tentative de reset pour email inexistant: ${email}`);
      return; // Retourner sans erreur
    }

    // Générer un token de reset
    const resetToken = this.passwordService.generateResetToken();
    const tokenHash = this.jwtService.hashRefreshToken(resetToken);
    const expiresAt = new Date(Date.now() + parseInt(this.configService.get('PASSWORD_RESET_TOKEN_TTL', '3600'), 10) * 1000);

    // Invalider les anciens tokens de reset
    await this.prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Créer le nouveau token de reset
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Construire l'URL de reset
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password/new?token=${resetToken}`;

    // Envoyer l'email
    await this.mailService.sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      resetToken,
      resetUrl,
    });

    this.logger.log(`Email de reset envoyé à: ${user.email}`);
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(resetDto: ResetPasswordDto) {
    const { token, newPassword } = resetDto;

    // Valider le nouveau mot de passe
    const passwordValidation = this.passwordService.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        error: 'Nouveau mot de passe invalide',
        details: passwordValidation.errors,
      });
    }

    const tokenHash = this.jwtService.hashRefreshToken(token);

    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new BadRequestException('Token de réinitialisation invalide ou expiré');
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await this.passwordService.hashPassword(newPassword);

    // Mettre à jour le mot de passe et marquer le token comme utilisé
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
      // Révoquer tous les refresh tokens existants pour forcer une nouvelle connexion
      this.prisma.refreshToken.updateMany({
        where: { userId: resetRecord.userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    this.logger.log(`Mot de passe réinitialisé pour: ${resetRecord.user.email}`);
  }

  /**
   * Méthodes utilitaires privées
   */
  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = this.jwtService.hashRefreshToken(refreshToken);
    const expiresAt = this.jwtService.getRefreshTokenExpiry();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  private async revokeUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}