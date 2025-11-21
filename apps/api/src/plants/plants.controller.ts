import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlantsService } from './plants.service';
import { CreatePlantDto, UpdatePlantDto, PlantDto, PlantDetailDto } from './dto/plant.dto';

@ApiTags('Plants')
@Controller('plants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plant' })
  @ApiResponse({
    status: 201,
    description: 'Plant created successfully',
    type: PlantDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Garden not found' })
  async create(@Request() req: any, @Body() createPlantDto: CreatePlantDto): Promise<PlantDto> {
    return this.plantsService.create(req.user.sub, createPlantDto);
  }

  @Get('by-garden/:gardenId')
  @ApiOperation({ summary: 'Get all plants in a garden' })
  @ApiResponse({
    status: 200,
    description: 'List of plants in the garden',
    type: [PlantDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Garden not found' })
  async findByGarden(@Request() req: any, @Param('gardenId') gardenId: string): Promise<PlantDto[]> {
    return this.plantsService.findByGarden(req.user.sub, gardenId);
  }

  @Get('by-project/:projectId')
  @ApiOperation({ summary: 'Get all plants in a project' })
  @ApiResponse({
    status: 200,
    description: 'List of plants in all gardens of the project',
    type: [PlantDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findByProject(@Request() req: any, @Param('projectId') projectId: string): Promise<PlantDto[]> {
    return this.plantsService.findByProject(req.user.sub, projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plant details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plant details with activities and reminders',
    type: PlantDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async findOne(@Request() req: any, @Param('id') id: string): Promise<PlantDetailDto> {
    return this.plantsService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plant' })
  @ApiResponse({
    status: 200,
    description: 'Plant updated successfully',
    type: PlantDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatePlantDto: UpdatePlantDto,
  ): Promise<PlantDto> {
    return this.plantsService.update(req.user.sub, id, updatePlantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a plant' })
  @ApiResponse({ status: 204, description: 'Plant deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.plantsService.remove(req.user.sub, id);
  }

  @Get('health/stats')
  @ApiOperation({ summary: 'Get health statistics for user plants' })
  @ApiQuery({ name: 'gardenId', required: false, description: 'Filter by garden ID' })
  @ApiResponse({
    status: 200,
    description: 'Plant health statistics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHealthStats(
    @Request() req: any,
    @Query('gardenId') gardenId?: string
  ): Promise<any> {
    return this.plantsService.getHealthStats(req.user.sub, gardenId);
  }
}