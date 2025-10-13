import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { DatabaseModule } from '../database/database.module';
import { JwtService } from '../common/services/jwt.service';
import { PasswordService } from '../common/services/password.service';
import { MailService } from '../common/services/mail.service';
import { RateLimitService } from '../common/services/rate-limit.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    JwtService,
    PasswordService,
    MailService,
    RateLimitService,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    JwtService,
    PasswordService,
    MailService,
    RateLimitService,
  ],
})
export class AuthModule {}
