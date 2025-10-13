import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
  /**
   * Hash un mot de passe avec bcrypt (saltRounds = 12 pour plus de sécurité)
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Vérifie un mot de passe contre son hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }

  /**
   * Valide la force d'un mot de passe
   * Minimum 8 caractères, au moins 1 lettre et 1 chiffre
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Génère un token sécurisé pour reset de mot de passe
   */
  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }
}