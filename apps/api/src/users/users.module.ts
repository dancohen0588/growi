import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { PasswordService } from '../common/services/password.service';
import { MailService } from '../common/services/mail.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    PasswordService,
    MailService,
  ],
  exports: [UsersService],
})
export class UsersModule {}