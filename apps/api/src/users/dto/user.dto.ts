import { IsEmail, IsString, IsOptional, IsEnum, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'L\'adresse email doit être valide' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe (min 8 caractères, 1 lettre + 1 chiffre)',
    example: 'Password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre',
  })
  password: string;

  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Le rôle doit être USER, EDITOR ou ADMIN' })
  role?: UserRole;

  @ApiProperty({
    description: 'Statut de l\'utilisateur',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Le statut doit être ACTIVE, SUSPENDED ou PENDING' })
  status?: UserStatus;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Le rôle doit être USER, EDITOR ou ADMIN' })
  role?: UserRole;

  @ApiProperty({
    description: 'Statut de l\'utilisateur',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Le statut doit être ACTIVE, SUSPENDED ou PENDING' })
  status?: UserStatus;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID unique de l\'utilisateur',
    example: 'uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Adresse email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Prénom',
    example: 'John',
    nullable: true,
  })
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille',
    example: 'Doe',
    nullable: true,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Rôle',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Statut',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Date de vérification email',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  emailVerifiedAt?: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Liste des utilisateurs',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({
    description: 'Informations de pagination',
    example: {
      total: 150,
      page: 1,
      limit: 20,
      totalPages: 8,
    },
  })
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class UserFiltersDto {
  @ApiProperty({
    description: 'Filtre par rôle',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Filtre par statut',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'Recherche par email ou nom',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Numéro de page (à partir de 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Nombre d\'éléments par page',
    example: 20,
    default: 20,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Tri (format: field:direction)',
    example: 'createdAt:desc',
    default: 'createdAt:desc',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class PasswordResetDto {
  @ApiProperty({
    description: 'Nouveau mot de passe temporaire généré',
    example: 'TempPass123',
  })
  temporaryPassword: string;

  @ApiProperty({
    description: 'Message de confirmation',
    example: 'Le mot de passe a été réinitialisé et envoyé par email',
  })
  message: string;
}