import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { MeModule } from './me/me.module';
import { ProjectsModule } from './projects/projects.module';
import { PlantsModule } from './plants/plants.module';
import { PlantBibleModule } from './plant-bible/plant-bible.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Modules
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    BlogModule,
    MeModule,
    ProjectsModule,
    PlantsModule,
    PlantBibleModule,
    UploadsModule,
  ],
})
export class AppModule {}