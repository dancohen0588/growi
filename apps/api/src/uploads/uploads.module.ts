import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [
    MulterModule.register({
      // Configuration is handled in the controller for more control
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}