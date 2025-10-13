import { Module } from '@nestjs/common';
import { AdminUsersController } from './users/admin-users.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AdminUsersController],
})
export class AdminModule {}