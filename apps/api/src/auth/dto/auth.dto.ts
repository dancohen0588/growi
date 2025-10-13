import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
    example: 'Ada',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur', 
    example: 'Lovelace',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Adresse email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'L\'adresse email doit être valide' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'Password123',
  })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Adresse email pour la réinitialisation',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'L\'adresse email doit être valide' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de réinitialisation reçu par email',
    example: 'abcdef123456789...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (min 8 caractères, 1 lettre + 1 chiffre)',
    example: 'NewPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre',
  })
  newPassword: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Informations utilisateur',
    example: {
      id: 'uuid-123',
      email: 'user@example.com',
      role: 'USER',
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
  })
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiProperty({
    description: 'Tokens d\'authentification',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
    },
  })
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Nouveaux tokens d\'authentification',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
    },
  })
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class UserProfileDto {
  @ApiProperty({
    description: 'Informations du profil utilisateur',
    example: {
      id: 'uuid-123',
      email: 'user@example.com',
      role: 'USER',
      firstName: 'Ada',
      lastName: 'Lovelace',
      status: 'ACTIVE',
      emailVerifiedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  })
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    status: string;
    emailVerifiedAt?: string;
    createdAt: string;
  };
}