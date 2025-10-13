import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../../users/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/guards/roles.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
  UserFiltersDto,
  PasswordResetDto,
} from '../../users/dto/user.dto';
import { UserRole } from '@prisma/client';

@ApiTags('admin')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('JWT-auth')
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste des utilisateurs avec filtres et pagination',
    description: 'Récupère la liste paginée des utilisateurs avec possibilité de filtrer par rôle, statut et recherche.',
  })
  @ApiQuery({ name: 'role', required: false, enum: UserRole, description: 'Filtre par rôle' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtre par statut' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par email ou nom' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'sort', required: false, description: 'Tri (format: field:direction)' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
    type: PaginatedUsersResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token d\'authentification requis',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - rôle ADMIN requis',
  })
  async findAll(@Query() filters: UserFiltersDto): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Statistiques des utilisateurs',
    description: 'Récupère les statistiques générales des utilisateurs (total, par statut, par rôle).',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques des utilisateurs',
    schema: {
      properties: {
        total: { type: 'number', example: 150 },
        byStatus: {
          type: 'object',
          properties: {
            active: { type: 'number', example: 120 },
            suspended: { type: 'number', example: 5 },
            pending: { type: 'number', example: 25 },
          },
        },
        byRole: {
          type: 'object',
          properties: {
            USER: { type: 'number', example: 140 },
            EDITOR: { type: 'number', example: 8 },
            ADMIN: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  async getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Détails d\'un utilisateur',
    description: 'Récupère les détails d\'un utilisateur spécifique par son ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Détails de l\'utilisateur',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description: 'Crée un nouvel utilisateur avec un rôle et statut spécifiés. Option d\'envoyer une invitation par email.',
  })
  @ApiQuery({
    name: 'sendInvitation',
    required: false,
    type: Boolean,
    description: 'Envoyer un email d\'invitation',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Un utilisateur existe déjà avec cette adresse email',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Query('sendInvitation') sendInvitation?: boolean,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto, sendInvitation);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur',
    description: 'Met à jour les informations d\'un utilisateur (nom, prénom, rôle, statut).',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Activer/Désactiver un utilisateur',
    description: 'Bascule le statut d\'un utilisateur entre ACTIVE et SUSPENDED. Révoque les tokens si suspendu.',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut utilisateur modifié',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async toggleStatus(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.toggleStatus(id);
  }

  @Post(':id/reset-password')
  @ApiOperation({
    summary: 'Réinitialiser le mot de passe',
    description: 'Génère un nouveau mot de passe temporaire et l\'envoie par email. Révoque tous les tokens existants.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé avec succès',
    type: PasswordResetDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de l\'envoi de l\'email',
  })
  async resetPassword(@Param('id') id: string): Promise<PasswordResetDto> {
    return this.usersService.resetPassword(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime définitivement un utilisateur et toutes ses données associées.',
  })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}