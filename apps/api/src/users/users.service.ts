import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from '../common/services/password.service';
import { MailService } from '../common/services/mail.service';
import { CreateUserDto, UpdateUserDto, UserFiltersDto } from './dto/user.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private mailService: MailService,
  ) {}

  /**
   * Transforme un objet utilisateur Prisma en DTO
   */
  private transformUserToDto(user: any) {
    return {
      ...user,
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Créer un nouvel utilisateur (Admin uniquement)
   */
  async create(createUserDto: CreateUserDto, sendInvitation = false) {
    const { email, password, firstName, lastName, role = UserRole.USER, status = UserStatus.ACTIVE } = createUserDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur existe déjà avec cette adresse email');
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
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Envoyer invitation par email si demandé
    if (sendInvitation) {
      try {
        await this.mailService.sendWelcomeEmail(user.email, user.firstName);
      } catch (error) {
        this.logger.error(`Failed to send invitation email to ${user.email}:`, error);
        // Ne pas faire échouer la création si l'email ne part pas
      }
    }

    this.logger.log(`Utilisateur créé par admin: ${user.email}`);
    return this.transformUserToDto(user);
  }

  /**
   * Récupérer tous les utilisateurs avec filtres et pagination
   */
  async findAll(filters: UserFiltersDto) {
    const {
      role,
      status,
      search,
      page = 1,
      limit = 20,
      sort = 'createdAt:desc'
    } = filters;

    // Construire les conditions de filtrage
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Parsing du tri
    const [sortField, sortDirection] = sort.split(':');
    const orderBy: any = {};
    orderBy[sortField] = sortDirection === 'desc' ? 'desc' : 'asc';

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Exécution des requêtes
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerifiedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => this.transformUserToDto(user)),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.transformUserToDto(user);
  }

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, role, status } = updateUserDto;

    // Vérifier que l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mettre à jour l'utilisateur
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Utilisateur mis à jour: ${user.email}`);
    return this.transformUserToDto(user);
  }

  /**
   * Supprimer un utilisateur
   */
  async remove(id: string) {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Supprimer l'utilisateur (hard delete)
    // En production, on pourrait préférer un soft delete
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`Utilisateur supprimé: ${existingUser.email}`);
  }

  /**
   * Activer/Désactiver un utilisateur
   */
  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, status: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Si l'utilisateur est suspendu, révoquer ses tokens
    if (newStatus === UserStatus.SUSPENDED) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: id, revoked: false },
        data: { revoked: true },
      });
    }

    this.logger.log(`Statut utilisateur changé: ${user.email} -> ${newStatus}`);
    return this.transformUserToDto(updatedUser);
  }

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   */
  async resetPassword(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await this.passwordService.hashPassword(temporaryPassword);

    // Mettre à jour le mot de passe
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    // Révoquer tous les tokens existants
    await this.prisma.refreshToken.updateMany({
      where: { userId: id, revoked: false },
      data: { revoked: true },
    });

    // Envoyer le nouveau mot de passe par email
    try {
      await this.sendTemporaryPasswordEmail(user.email, user.firstName, temporaryPassword);
    } catch (error) {
      this.logger.error(`Failed to send temporary password email to ${user.email}:`, error);
      throw new BadRequestException('Erreur lors de l\'envoi de l\'email');
    }

    this.logger.log(`Mot de passe réinitialisé pour: ${user.email}`);
    
    return {
      temporaryPassword,
      message: 'Le mot de passe a été réinitialisé et envoyé par email',
    };
  }

  /**
   * Obtenir les statistiques des utilisateurs
   */
  async getStats() {
    const [total, active, suspended, pending, byRole] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
      this.prisma.user.count({ where: { status: UserStatus.PENDING } }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
    ]);

    const roleStats = byRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {});

    return {
      total,
      byStatus: {
        active,
        suspended,
        pending,
      },
      byRole: roleStats,
    };
  }

  /**
   * Méthodes utilitaires privées
   */
  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async sendTemporaryPasswordEmail(email: string, firstName: string | null, temporaryPassword: string): Promise<void> {
    const name = firstName || 'Utilisateur';
    
    const subject = 'Nouveau mot de passe temporaire - Growi';
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau mot de passe temporaire</title>
    <style>
        body { font-family: 'Raleway', Arial, sans-serif; line-height: 1.6; color: #1E5631; background-color: #F9F7E8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #B4DD7F 0%, #1E5631 100%); color: white; padding: 30px 40px; text-align: center; border-radius: 20px 20px 0 0; }
        .content { padding: 40px; }
        .password { background: #F9F7E8; padding: 20px; border-radius: 12px; text-align: center; font-family: monospace; font-size: 24px; font-weight: bold; color: #1E5631; margin: 20px 0; letter-spacing: 2px; }
        .footer { background: #F9F7E8; padding: 30px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 20px 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .warning { background: #FFF3CD; border: 1px solid #FFEB3B; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌱 Growi</div>
            <h1 style="margin: 0;">Nouveau mot de passe temporaire</h1>
        </div>
        <div class="content">
            <p>Bonjour ${name},</p>
            <p>Votre mot de passe a été réinitialisé par un administrateur. Voici votre nouveau mot de passe temporaire :</p>
            <div class="password">${temporaryPassword}</div>
            <div class="warning">
                <strong>⚠️ Important :</strong>
                <ul style="margin: 10px 0 0 20px;">
                    <li>Connectez-vous immédiatement et changez ce mot de passe</li>
                    <li>Ce mot de passe est temporaire et doit être modifié</li>
                    <li>Ne partagez jamais vos identifiants</li>
                </ul>
            </div>
            <p>Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement l'administration.</p>
            <p>Cordialement,<br>L'équipe Growi 🌿</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© 2024 Growi - Assistant de jardinage intelligent</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Bonjour ${name},

Votre mot de passe a été réinitialisé par un administrateur.

Votre nouveau mot de passe temporaire : ${temporaryPassword}

⚠️ IMPORTANT :
- Connectez-vous immédiatement et changez ce mot de passe
- Ce mot de passe est temporaire et doit être modifié
- Ne partagez jamais vos identifiants

Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement l'administration.

Cordialement,
L'équipe Growi 🌿

---
Cet email a été envoyé automatiquement, merci de ne pas y répondre.
© 2024 Growi - Assistant de jardinage intelligent
`;

    // Cette implémentation utilise le service de mail existant
    // En production, on pourrait avoir un template spécialisé
    await this.mailService['transporter'].sendMail({
      from: 'noreply@growi.io',
      to: email,
      subject,
      html,
      text,
    });
  }
}