import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectDto, ProjectDetailDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    const project = await this.prisma.gardenProject.create({
      data: {
        ...createProjectDto,
        userId,
      },
    });

    return this.transformProject(project);
  }

  async findAll(userId: string): Promise<ProjectDto[]> {
    const projects = await this.prisma.gardenProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map(project => this.transformProject(project));
  }

  async findOne(userId: string, id: string): Promise<ProjectDetailDto> {
    const project = await this.prisma.gardenProject.findFirst({
      where: { id, userId },
      include: {
        gardens: {
          include: {
            _count: {
              select: { plants: true }
            }
          }
        },
        _count: {
          select: { gardens: true }
        }
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    // Calculate total plants count across all gardens
    const plantCount = project.gardens.reduce((total, garden) => total + garden._count.plants, 0);

    return {
      ...this.transformProject(project),
      gardens: project.gardens.map(garden => ({
        id: garden.id,
        name: garden.name,
        city: garden.city,
        postalCode: garden.postalCode,
        totalAreaM2: garden.totalAreaM2,
        plantCount: garden._count.plants,
        createdAt: garden.createdAt,
        updatedAt: garden.updatedAt,
      })),
      gardenCount: project._count.gardens,
      plantCount,
    };
  }

  async update(userId: string, id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectDto> {
    // Verify ownership
    const existingProject = await this.prisma.gardenProject.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      throw new NotFoundException('Projet non trouvé');
    }

    const updatedProject = await this.prisma.gardenProject.update({
      where: { id },
      data: updateProjectDto,
    });

    return this.transformProject(updatedProject);
  }

  async remove(userId: string, id: string): Promise<void> {
    // Verify ownership
    const existingProject = await this.prisma.gardenProject.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      throw new NotFoundException('Projet non trouvé');
    }

    await this.prisma.gardenProject.delete({
      where: { id },
    });
  }

  private transformProject(project: any): ProjectDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      coverImageUrl: project.coverImageUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}