import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePlantDto, UpdatePlantDto, PlantDto, PlantDetailDto } from './dto/plant.dto';

@Injectable()
export class PlantsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPlantDto: CreatePlantDto): Promise<PlantDto> {
    // Verify that the garden belongs to the user
    const garden = await this.prisma.garden.findFirst({
      where: { 
        id: createPlantDto.gardenId,
        userId 
      }
    });

    if (!garden) {
      throw new NotFoundException('Jardin non trouvé');
    }

    // If zoneId is provided, verify it belongs to the same garden
    if (createPlantDto.zoneId) {
      const zone = await this.prisma.gardenZone.findFirst({
        where: {
          id: createPlantDto.zoneId,
          gardenId: createPlantDto.gardenId
        }
      });

      if (!zone) {
        throw new BadRequestException('Zone non trouvée dans ce jardin');
      }
    }

    // Check if plant with same name exists in the same garden
    const existingPlant = await this.prisma.plant.findFirst({
      where: {
        gardenId: createPlantDto.gardenId,
        commonName: createPlantDto.commonName
      }
    });

    if (existingPlant) {
      throw new BadRequestException('Une plante avec ce nom existe déjà dans ce jardin');
    }

    const plant = await this.prisma.plant.create({
      data: {
        gardenId: createPlantDto.gardenId,
        zoneId: createPlantDto.zoneId || null,
        scientificName: createPlantDto.scientificName || null,
        commonName: createPlantDto.commonName,
        plantType: createPlantDto.plantType,
        cycle: createPlantDto.cycle || null,
        plantedAt: createPlantDto.plantedAt ? new Date(createPlantDto.plantedAt) : null,
        estimatedAgeMonths: createPlantDto.estimatedAgeMonths || null,
        location: createPlantDto.location || {},
        exposure: createPlantDto.exposure || null,
        waterNeed: createPlantDto.waterNeed || null,
        wateringFrequencyDays: createPlantDto.wateringFrequencyDays || null,
        wateringType: createPlantDto.wateringType || null,
        substrate: createPlantDto.substrate || null,
        photosUrls: createPlantDto.photosUrls || [],
        notes: createPlantDto.notes || null
      }
    });

    return this.transformPlant(plant);
  }

  async findByGarden(userId: string, gardenId: string): Promise<PlantDto[]> {
    // Verify garden ownership
    const garden = await this.prisma.garden.findFirst({
      where: { id: gardenId, userId }
    });

    if (!garden) {
      throw new NotFoundException('Jardin non trouvé');
    }

    const plants = await this.prisma.plant.findMany({
      where: { gardenId },
      include: {
        zone: {
          select: { name: true }
        }
      },
      orderBy: [
        { isAlive: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    return plants.map(plant => this.transformPlant(plant));
  }

  async findByProject(userId: string, projectId: string): Promise<PlantDto[]> {
    // Verify project ownership and get all gardens
    const gardens = await this.prisma.garden.findMany({
      where: {
        project: { id: projectId, userId }
      },
      select: { id: true }
    });

    if (gardens.length === 0) {
      throw new NotFoundException('Projet non trouvé ou sans jardin');
    }

    const gardenIds = gardens.map(g => g.id);

    const plants = await this.prisma.plant.findMany({
      where: {
        gardenId: { in: gardenIds }
      },
      include: {
        garden: {
          select: { name: true }
        },
        zone: {
          select: { name: true }
        }
      },
      orderBy: [
        { isAlive: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    return plants.map(plant => this.transformPlant(plant));
  }

  async findOne(userId: string, id: string): Promise<PlantDetailDto> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id,
        garden: { userId }
      },
      include: {
        garden: {
          select: { id: true, name: true }
        },
        zone: {
          select: { id: true, name: true }
        },
        activities: {
          orderBy: { occurredAt: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            occurredAt: true,
            quantity: true,
            unit: true,
            notes: true,
            photoUrls: true
          }
        },
        reminders: {
          where: { status: 'PENDING' },
          orderBy: { nextAt: 'asc' },
          take: 5,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            nextAt: true
          }
        }
      }
    });

    if (!plant) {
      throw new NotFoundException('Plante non trouvée');
    }

    return {
      ...this.transformPlant(plant),
      garden: plant.garden,
      zone: plant.zone,
      activities: plant.activities,
      reminders: plant.reminders
    };
  }

  async update(userId: string, id: string, updatePlantDto: UpdatePlantDto): Promise<PlantDto> {
    // Verify ownership
    const existingPlant = await this.prisma.plant.findFirst({
      where: {
        id,
        garden: { userId }
      },
      include: { garden: true }
    });

    if (!existingPlant) {
      throw new NotFoundException('Plante non trouvée');
    }

    // If zoneId is being updated, verify it belongs to the same garden
    if (updatePlantDto.zoneId !== undefined && updatePlantDto.zoneId !== null) {
      const zone = await this.prisma.gardenZone.findFirst({
        where: {
          id: updatePlantDto.zoneId,
          gardenId: existingPlant.gardenId
        }
      });

      if (!zone) {
        throw new BadRequestException('Zone non trouvée dans ce jardin');
      }
    }

    // Check if new common name conflicts with existing plants
    if (updatePlantDto.commonName && updatePlantDto.commonName !== existingPlant.commonName) {
      const conflictingPlant = await this.prisma.plant.findFirst({
        where: {
          gardenId: existingPlant.gardenId,
          commonName: updatePlantDto.commonName,
          NOT: { id }
        }
      });

      if (conflictingPlant) {
        throw new BadRequestException('Une plante avec ce nom existe déjà dans ce jardin');
      }
    }

    const updateData: any = { ...updatePlantDto };
    if (updatePlantDto.plantedAt) {
      updateData.plantedAt = new Date(updatePlantDto.plantedAt);
    }

    const updatedPlant = await this.prisma.plant.update({
      where: { id },
      data: updateData
    });

    return this.transformPlant(updatedPlant);
  }

  async remove(userId: string, id: string): Promise<void> {
    // Verify ownership
    const existingPlant = await this.prisma.plant.findFirst({
      where: {
        id,
        garden: { userId }
      }
    });

    if (!existingPlant) {
      throw new NotFoundException('Plante non trouvée');
    }

    await this.prisma.plant.delete({
      where: { id }
    });
  }

  async getHealthStats(userId: string, gardenId?: string): Promise<any> {
    const where: any = {
      garden: { userId },
      isAlive: true
    };

    if (gardenId) {
      where.gardenId = gardenId;
    }

    const [total, withActivities, withReminders] = await Promise.all([
      this.prisma.plant.count({ where }),
      this.prisma.plant.count({
        where: {
          ...where,
          activities: { some: {} }
        }
      }),
      this.prisma.plant.count({
        where: {
          ...where,
          reminders: { 
            some: { 
              status: 'PENDING',
              nextAt: { gte: new Date() }
            }
          }
        }
      })
    ]);

    return {
      total,
      withActivities,
      withReminders,
      needsAttention: total - withActivities // Plants without recent activities
    };
  }

  private transformPlant(plant: any): PlantDto {
    return {
      id: plant.id,
      gardenId: plant.gardenId,
      zoneId: plant.zoneId,
      scientificName: plant.scientificName,
      commonName: plant.commonName,
      plantType: plant.plantType,
      cycle: plant.cycle,
      plantedAt: plant.plantedAt,
      estimatedAgeMonths: plant.estimatedAgeMonths,
      location: plant.location,
      exposure: plant.exposure,
      waterNeed: plant.waterNeed,
      wateringFrequencyDays: plant.wateringFrequencyDays,
      wateringType: plant.wateringType,
      substrate: plant.substrate,
      photosUrls: plant.photosUrls || [],
      isAlive: plant.isAlive,
      notes: plant.notes,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt
    };
  }
}