import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { 
  OverviewDto, 
  ProjectSummaryDto, 
  PlantSummaryDto, 
  UpcomingReminderDto, 
  RecentActivityDto, 
  WeatherSnapshotDto, 
  ActiveAlertDto 
} from './dto/overview.dto';
import { ReminderStatus } from '@prisma/client';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string): Promise<OverviewDto> {
    // Fetch all data in parallel for better performance
    const [
      projects,
      plants,
      upcomingReminders,
      recentActivities,
      latestWeather,
      activeAlerts,
      planCount
    ] = await Promise.all([
      this.getProjectsSummary(userId),
      this.getPlantsSummary(userId),
      this.getUpcomingReminders(userId, 5),
      this.getRecentActivities(userId, 5),
      this.getLatestWeather(userId),
      this.getActiveAlerts(userId),
      this.getGardenPlanCount(userId)
    ]);

    const totalPlants = await this.getTotalPlantsCount(userId);
    const hasGardenPlan = planCount > 0;

    return {
      projects,
      totalPlants,
      plants,
      upcomingReminders,
      recentActivities,
      weather: latestWeather,
      activeAlerts,
      hasGardenPlan
    };
  }

  private async getProjectsSummary(userId: string): Promise<ProjectSummaryDto[]> {
    const projects = await this.prisma.gardenProject.findMany({
      where: { userId },
      include: {
        _count: {
          select: { gardens: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      coverImageUrl: project.coverImageUrl,
      gardenCount: project._count.gardens,
      updatedAt: project.updatedAt
    }));
  }

  private async getTotalPlantsCount(userId: string): Promise<number> {
    return this.prisma.plant.count({
      where: {
        garden: { userId },
        isAlive: true
      }
    });
  }

  private async getPlantsSummary(userId: string): Promise<PlantSummaryDto[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        garden: { userId },
        isAlive: true
      },
      include: {
        garden: {
          select: { name: true }
        },
        zone: {
          select: { name: true }
        },
        activities: {
          orderBy: { occurredAt: 'desc' },
          take: 1,
          select: {
            type: true,
            occurredAt: true
          }
        },
        reminders: {
          where: { status: ReminderStatus.PENDING },
          orderBy: { nextAt: 'asc' },
          take: 1,
          select: {
            title: true,
            nextAt: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10 // Limit to first 10 plants for overview
    });

    return plants.map(plant => {
      const lastActivity = plant.activities[0];
      const nextReminder = plant.reminders[0];
      
      // Simple health status calculation based on last activity
      let healthStatus: 'good' | 'warning' | 'danger' = 'good';
      if (lastActivity) {
        const daysSinceActivity = Math.floor(
          (Date.now() - lastActivity.occurredAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceActivity > 14) {
          healthStatus = 'danger';
        } else if (daysSinceActivity > 7) {
          healthStatus = 'warning';
        }
      }

      return {
        id: plant.id,
        commonName: plant.commonName,
        scientificName: plant.scientificName,
        gardenName: plant.garden.name,
        zoneName: plant.zone?.name,
        isAlive: plant.isAlive,
        lastActivity: lastActivity ? this.getActivityTypeLabel(lastActivity.type) : undefined,
        lastActivityDate: lastActivity?.occurredAt,
        nextReminder: nextReminder?.title,
        nextReminderDate: nextReminder?.nextAt,
        healthStatus
      };
    });
  }

  private async getUpcomingReminders(userId: string, limit: number): Promise<UpcomingReminderDto[]> {
    const reminders = await this.prisma.reminder.findMany({
      where: {
        userId,
        status: ReminderStatus.PENDING,
        nextAt: { gte: new Date() }
      },
      include: {
        plant: {
          select: { commonName: true }
        },
        garden: {
          select: { name: true }
        }
      },
      orderBy: { nextAt: 'asc' },
      take: limit
    });

    return reminders.map(reminder => ({
      id: reminder.id,
      title: reminder.title,
      description: reminder.description,
      nextAt: reminder.nextAt,
      status: reminder.status,
      plantName: reminder.plant?.commonName,
      gardenName: reminder.garden?.name
    }));
  }

  private async getRecentActivities(userId: string, limit: number): Promise<RecentActivityDto[]> {
    const activities = await this.prisma.activity.findMany({
      where: { userId },
      include: {
        plant: {
          select: { commonName: true }
        },
        garden: {
          select: { name: true }
        }
      },
      orderBy: { occurredAt: 'desc' },
      take: limit
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      occurredAt: activity.occurredAt,
      plantName: activity.plant?.commonName,
      gardenName: activity.garden.name,
      quantity: activity.quantity,
      unit: activity.unit,
      notes: activity.notes,
      photoUrls: activity.photoUrls
    }));
  }

  private async getLatestWeather(userId: string): Promise<WeatherSnapshotDto | undefined> {
    // Get the most recent weather data from any of the user's gardens
    const latestSnapshot = await this.prisma.environmentalSnapshot.findFirst({
      where: {
        garden: { userId }
      },
      orderBy: { recordedAt: 'desc' }
    });

    if (!latestSnapshot) return undefined;

    return {
      tempMinC: latestSnapshot.tempMinC,
      tempMaxC: latestSnapshot.tempMaxC,
      tempAvgC: latestSnapshot.tempAvgC,
      rainfallMm: latestSnapshot.rainfallMm,
      uvIndex: latestSnapshot.uvIndex,
      sunshineHours: latestSnapshot.sunshineHours,
      frostRisk: latestSnapshot.frostRisk,
      recordedAt: latestSnapshot.recordedAt
    };
  }

  private async getActiveAlerts(userId: string): Promise<ActiveAlertDto[]> {
    const alerts = await this.prisma.alert.findMany({
      where: {
        userId,
        acknowledgedAt: null // Only unacknowledged alerts
      },
      include: {
        plant: {
          select: { commonName: true }
        },
        garden: {
          select: { name: true }
        }
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return alerts.map(alert => ({
      id: alert.id,
      code: alert.code,
      severity: alert.severity,
      message: alert.message,
      plantName: alert.plant?.commonName,
      gardenName: alert.garden?.name,
      createdAt: alert.createdAt
    }));
  }

  private async getGardenPlanCount(userId: string): Promise<number> {
    return this.prisma.garden.count({
      where: {
        userId,
        OR: [
          { planBackgroundImageUrl: { not: null } },
          { planWidthPx: { not: null } }
        ]
      }
    });
  }

  private getActivityTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      WATERING: 'Arrosage',
      PRUNING: 'Taille',
      FERTILIZING: 'Fertilisation',
      TREATMENT: 'Traitement',
      HARVEST: 'Récolte',
      REPOTTING: 'Rempotage',
      SOWING: 'Semis',
      TRANSPLANTING: 'Transplantation',
      OBSERVATION: 'Observation',
      DISEASE: 'Maladie',
      PEST: 'Nuisible'
    };
    return labels[type] || type;
  }
}