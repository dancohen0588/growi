import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean, IsEnum, IsArray, IsNumber, IsDateString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PlantType, PlantCycle, Exposure, WaterNeed, IrrigationType } from '@prisma/client';

export class CreatePlantDto {
  @ApiProperty()
  @IsUUID()
  gardenId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  scientificName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  commonName: string;

  @ApiProperty({ enum: PlantType })
  @IsEnum(PlantType)
  plantType: PlantType;

  @ApiProperty({ enum: PlantCycle, required: false })
  @IsOptional()
  @IsEnum(PlantCycle)
  cycle?: PlantCycle;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plantedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  estimatedAgeMonths?: number;

  @ApiProperty({ description: 'Location coordinates as JSON (point or polygon)', required: false })
  @IsOptional()
  location?: any;

  @ApiProperty({ enum: Exposure, required: false })
  @IsOptional()
  @IsEnum(Exposure)
  exposure?: Exposure;

  @ApiProperty({ enum: WaterNeed, required: false })
  @IsOptional()
  @IsEnum(WaterNeed)
  waterNeed?: WaterNeed;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  wateringFrequencyDays?: number;

  @ApiProperty({ enum: IrrigationType, required: false })
  @IsOptional()
  @IsEnum(IrrigationType)
  wateringType?: IrrigationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  substrate?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photosUrls?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class UpdatePlantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  scientificName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  commonName?: string;

  @ApiProperty({ enum: PlantType, required: false })
  @IsOptional()
  @IsEnum(PlantType)
  plantType?: PlantType;

  @ApiProperty({ enum: PlantCycle, required: false })
  @IsOptional()
  @IsEnum(PlantCycle)
  cycle?: PlantCycle;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plantedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  estimatedAgeMonths?: number;

  @ApiProperty({ description: 'Location coordinates as JSON', required: false })
  @IsOptional()
  location?: any;

  @ApiProperty({ enum: Exposure, required: false })
  @IsOptional()
  @IsEnum(Exposure)
  exposure?: Exposure;

  @ApiProperty({ enum: WaterNeed, required: false })
  @IsOptional()
  @IsEnum(WaterNeed)
  waterNeed?: WaterNeed;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  wateringFrequencyDays?: number;

  @ApiProperty({ enum: IrrigationType, required: false })
  @IsOptional()
  @IsEnum(IrrigationType)
  wateringType?: IrrigationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  substrate?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photosUrls?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class PlantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gardenId: string;

  @ApiProperty({ required: false })
  zoneId?: string;

  @ApiProperty({ required: false })
  scientificName?: string;

  @ApiProperty()
  commonName: string;

  @ApiProperty({ enum: PlantType })
  plantType: PlantType;

  @ApiProperty({ enum: PlantCycle, required: false })
  cycle?: PlantCycle;

  @ApiProperty({ required: false })
  plantedAt?: Date;

  @ApiProperty({ required: false })
  estimatedAgeMonths?: number;

  @ApiProperty({ required: false })
  location?: any;

  @ApiProperty({ enum: Exposure, required: false })
  exposure?: Exposure;

  @ApiProperty({ enum: WaterNeed, required: false })
  waterNeed?: WaterNeed;

  @ApiProperty({ required: false })
  wateringFrequencyDays?: number;

  @ApiProperty({ enum: IrrigationType, required: false })
  wateringType?: IrrigationType;

  @ApiProperty({ required: false })
  substrate?: string;

  @ApiProperty({ type: [String] })
  photosUrls: string[];

  @ApiProperty()
  isAlive: boolean;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PlantDetailDto extends PlantDto {
  @ApiProperty({ required: false })
  garden?: {
    id: string;
    name: string;
  };

  @ApiProperty({ required: false })
  zone?: {
    id: string;
    name: string;
  };

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  activities: any[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  reminders: any[];
}