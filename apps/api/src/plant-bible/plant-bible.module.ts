import { Module } from '@nestjs/common';
import { PlantBibleController } from './plant-bible.controller';
import { PlantBibleService } from './plant-bible.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlantBibleController],
  providers: [PlantBibleService],
  exports: [PlantBibleService],
})
export class PlantBibleModule {}