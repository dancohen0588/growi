import { Controller, Post, Get, Body, Request, Ip, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  AuthResponseDto,
  RefreshResponseDto,
  UserProfileDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Inscription d\'un nouvel utilisateur',
    description: 'Crée un nouveau compte utilisateur avec email et mot de passe. Retourne les tokens d\'authentification.',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Un compte existe déjà avec cette adresse email',
    schema: {
      properties: {
        error: { type: 'string', example: 'Un compte existe déjà avec cette adresse email' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    schema: {
      properties: {
        error: { type: 'string', example: 'Mot de passe invalide' },
        details: { type: 'array', items: { type: 'string' }, example: ['Le mot de passe doit contenir au moins 8 caractères'] },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur avec email et mot de passe. Inclut le rate limiting (5 tentatives par 10 minutes).',
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides ou trop de tentatives',
    schema: {
      anyOf: [
        {
          properties: {
            error: { type: 'string', example: 'Identifiants invalides' },
          },
        },
        {
          properties: {
            error: { type: 'string', example: 'Trop de tentatives de connexion' },
            resetTime: { type: 'string', format: 'date-time' },
          },
        },
      ],
    },
  })
  async login(@Body() loginDto: LoginDto, @Ip() clientIp: string): Promise<AuthResponseDto> {
    return this.authService.login(loginDto, clientIp);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh des tokens d\'authentification',
    description: 'Génère de nouveaux tokens d\'accès et de refresh à partir d\'un refresh token valide. Révoque l\'ancien refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens rafraîchis avec succès',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide ou expiré',
    schema: {
      properties: {
        error: { type: 'string', example: 'Refresh token invalide ou expiré' },
      },
    },
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Déconnexion utilisateur',
    description: 'Révoque le refresh token pour déconnecter l\'utilisateur.',
  })
  @ApiResponse({
    status: 204,
    description: 'Déconnexion réussie',
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    await this.authService.logout(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer le profil utilisateur',
    description: 'Retourne les informations du profil de l\'utilisateur authentifié.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token d\'authentification requis ou invalide',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getProfile(@Request() req): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.sub);
  }

  @Public()
  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Demande de réinitialisation de mot de passe',
    description: 'Envoie un email avec un lien de réinitialisation de mot de passe. Ne révèle pas si l\'email existe.',
  })
  @ApiResponse({
    status: 200,
    description: 'Si l\'email existe, un lien de réinitialisation a été envoyé',
    schema: {
      properties: {
        message: { type: 'string', example: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email invalide',
  })
  async requestPasswordReset(@Body() requestDto: RequestPasswordResetDto): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(requestDto);
    return {
      message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Réinitialiser le mot de passe',
    description: 'Réinitialise le mot de passe avec le token reçu par email. Révoque tous les refresh tokens existants.',
  })
  @ApiResponse({
    status: 204,
    description: 'Mot de passe réinitialisé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Token invalide ou nouveau mot de passe invalide',
    schema: {
      anyOf: [
        {
          properties: {
            error: { type: 'string', example: 'Token de réinitialisation invalide ou expiré' },
          },
        },
        {
          properties: {
            error: { type: 'string', example: 'Nouveau mot de passe invalide' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
      ],
    },
  })
  async resetPassword(@Body() resetDto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(resetDto);
  }
}