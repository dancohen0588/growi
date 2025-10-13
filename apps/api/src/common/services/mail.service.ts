import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface PasswordResetEmailData {
  email: string;
  firstName?: string;
  resetToken: string;
  resetUrl: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  /**
   * Envoie un email de reset de mot de passe
   */
  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const { email, firstName, resetUrl } = data;

    const subject = 'Réinitialisation de votre mot de passe - Growi';
    const html = this.generatePasswordResetEmailTemplate(firstName, resetUrl);
    const text = this.generatePasswordResetEmailText(firstName, resetUrl);

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to: email,
        subject,
        html,
        text,
      });

      this.logger.log(`Email de reset envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Erreur envoi email à ${email}:`, error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  /**
   * Génère le template HTML pour l'email de reset
   */
  private generatePasswordResetEmailTemplate(firstName: string | undefined, resetUrl: string): string {
    const name = firstName ? firstName : 'Utilisateur';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        body { font-family: 'Raleway', Arial, sans-serif; line-height: 1.6; color: #1E5631; background-color: #F9F7E8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #B4DD7F 0%, #1E5631 100%); color: white; padding: 30px 40px; text-align: center; border-radius: 20px 20px 0 0; }
        .content { padding: 40px; }
        .button { display: inline-block; background: linear-gradient(135deg, #B4DD7F 0%, #1E5631 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 15px rgba(180, 221, 127, 0.3); }
        .footer { background: #F9F7E8; padding: 30px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 20px 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌱 Growi</div>
            <h1 style="margin: 0;">Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
            <p>Bonjour ${name},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Growi.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p><strong>Ce lien est valide pendant 1 heure.</strong></p>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe actuel reste inchangé.</p>
            <p>Cordialement,<br>L'équipe Growi 🌿</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© 2024 Growi - Assistant de jardinage intelligent</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Génère le texte brut pour l'email de reset
   */
  private generatePasswordResetEmailText(firstName: string | undefined, resetUrl: string): string {
    const name = firstName ? firstName : 'Utilisateur';

    return `
Bonjour ${name},

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Growi.

Pour créer un nouveau mot de passe, cliquez sur le lien suivant :
${resetUrl}

Ce lien est valide pendant 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe actuel reste inchangé.

Cordialement,
L'équipe Growi 🌿

---
Cet email a été envoyé automatiquement, merci de ne pas y répondre.
© 2024 Growi - Assistant de jardinage intelligent
`;
  }

  /**
   * Envoie un email de bienvenue après inscription
   */
  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    const name = firstName ? firstName : 'Jardinier';
    const subject = 'Bienvenue dans la communauté Growi ! 🌱';

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue chez Growi</title>
    <style>
        body { font-family: 'Raleway', Arial, sans-serif; line-height: 1.6; color: #1E5631; background-color: #F9F7E8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #B4DD7F 0%, #1E5631 100%); color: white; padding: 30px 40px; text-align: center; border-radius: 20px 20px 0 0; }
        .content { padding: 40px; }
        .footer { background: #F9F7E8; padding: 30px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 20px 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌱 Growi</div>
            <h1 style="margin: 0;">Bienvenue dans l'aventure !</h1>
        </div>
        <div class="content">
            <p>Bonjour ${name},</p>
            <p>Félicitations ! Votre compte Growi a été créé avec succès. 🎉</p>
            <p>Vous faites maintenant partie d'une communauté de jardiniers passionnés qui utilisent la technologie pour faire prospérer leurs plantes.</p>
            <p>Avec Growi, vous pourrez :</p>
            <ul>
                <li>🌿 Identifier vos plantes facilement</li>
                <li>⏰ Recevoir des rappels d'arrosage personnalisés</li>
                <li>📷 Diagnostiquer les problèmes avec l'IA</li>
                <li>📆 Planifier vos tâches de jardinage</li>
            </ul>
            <p>Prêt à commencer votre nouvelle aventure de jardinage connecté ?</p>
            <p>Cordialement,<br>L'équipe Growi 🌿</p>
        </div>
        <div class="footer">
            <p>© 2024 Growi - Assistant de jardinage intelligent</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Bonjour ${name},

Félicitations ! Votre compte Growi a été créé avec succès. 🎉

Vous faites maintenant partie d'une communauté de jardiniers passionnés qui utilisent la technologie pour faire prospérer leurs plantes.

Avec Growi, vous pourrez :
- 🌿 Identifier vos plantes facilement
- ⏰ Recevoir des rappels d'arrosage personnalisés  
- 📷 Diagnostiquer les problèmes avec l'IA
- 📆 Planifier vos tâches de jardinage

Prêt à commencer votre nouvelle aventure de jardinage connecté ?

Cordialement,
L'équipe Growi 🌿

---
© 2024 Growi - Assistant de jardinage intelligent
`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to: email,
        subject,
        html,
        text,
      });

      this.logger.log(`Email de bienvenue envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Erreur envoi email de bienvenue à ${email}:`, error);
      // Ne pas faire échouer l'inscription si l'email ne part pas
    }
  }
}