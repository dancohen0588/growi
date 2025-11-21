import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ActivityType, ReminderStatus, Severity } from '@prisma/client';

export class ProjectSummaryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiProperty()
  @IsNumber()
  gardenCount: number;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt: Date;
}

export class PlantSummaryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  commonName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scientificName?: string;

  @ApiProperty()
  @IsString()
  gardenName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zoneName?: string;

  @ApiProperty()
  @IsBoolean()
  isAlive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastActivity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastActivityDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nextReminder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  nextReminderDate?: Date;

  @ApiProperty()
  @IsString()
  healthStatus: 'good' | 'warning' | 'danger';
}

export class UpcomingReminderDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  nextAt: Date;

  @ApiProperty({ enum: ReminderStatus })
  @IsEnum(ReminderStatus)
  status: ReminderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  plantName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gardenName?: string;
}

export class RecentActivityDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  occurredAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  plantName?: string;

  @ApiProperty()
  @IsString()
  gardenName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];
}

export class WeatherSnapshotDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tempMinC?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tempMaxC?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tempAvgC?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rainfallMm?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  uvIndex?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sunshineHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  frostRisk?: boolean;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  recordedAt: Date;
}

export class ActiveAlertDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ enum: Severity })
  @IsEnum(Severity)
  severity: Severity;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  plantName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gardenName?: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt: Date;
}

export class OverviewDto {
  @ApiProperty({ type: [ProjectSummaryDto] })
  @IsArray()
  projects: ProjectSummaryDto[];

  @ApiProperty()
  @IsNumber()
  totalPlants: number;

  @ApiProperty({ type: [PlantSummaryDto] })
  @IsArray()
  plants: PlantSummaryDto[];

  @ApiProperty({ type: [UpcomingReminderDto] })
  @IsArray()
  upcomingReminders: UpcomingReminderDto[];

  @ApiProperty({ type: [RecentActivityDto] })
  @IsArray()
  recentActivities: RecentActivityDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  weather?: WeatherSnapshotDto;

  @ApiProperty({ type: [ActiveAlertDto] })
  @IsArray()
  activeAlerts: ActiveAlertDto[];

  @ApiProperty()
  @IsBoolean()
  hasGardenPlan: boolean;
}