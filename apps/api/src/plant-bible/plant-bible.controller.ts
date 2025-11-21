import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';
import { PlantBibleService } from './plant-bible.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreatePlantSpeciesDto,
  UpdatePlantSpeciesDto,
  PlantSpeciesDto,
  PlantSpeciesDetailDto,
  PlantSpeciesSearchDto,
  PaginatedPlantSpeciesDto,
  PlantBibleFiltersDto,
  CsvImportOptionsDto,
  CsvImportResultDto,
  CsvImportPreviewDto,
} from './dto/plant-species.dto';

@ApiTags('Plant Bible')
@Controller('plant-bible')
export class PlantBibleController {
  constructor(private plantBibleService: PlantBibleService) {}

  /**
   * PUBLIC ENDPOINTS - Bible des plantes accessible à tous
   */

  @Public()
  @Get('species')
  @ApiOperation({
    summary: 'Rechercher dans la Bible des plantes',
    description: 'Liste des espèces avec recherche textuelle, filtres et pagination. Accessible sans authentification.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des espèces avec pagination',
    type: PaginatedPlantSpeciesDto,
  })
  async searchSpecies(@Query() searchDto: PlantSpeciesSearchDto): Promise<PaginatedPlantSpeciesDto> {
    return this.plantBibleService.searchSpecies(searchDto);
  }

  @Public()
  @Get('species/:slug')
  @ApiOperation({
    summary: 'Détail d\'une espèce de plante',
    description: 'Fiche complète d\'une espèce avec toutes les informations de culture, entretien, santé, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Détail complet de l\'espèce',
    type: PlantSpeciesDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Espèce non trouvée',
  })
  async getSpeciesBySlug(@Param('slug') slug: string): Promise<PlantSpeciesDetailDto> {
    return this.plantBibleService.findBySlug(slug);
  }

  @Public()
  @Get('filters')
  @ApiOperation({
    summary: 'Valeurs disponibles pour les filtres',
    description: 'Retourne toutes les valeurs possibles pour construire les filtres côté frontend.',
  })
  @ApiResponse({
    status: 200,
    description: 'Valeurs des filtres',
    type: PlantBibleFiltersDto,
  })
  async getFilterValues(): Promise<PlantBibleFiltersDto> {
    return this.plantBibleService.getFilterValues();
  }

  /**
   * ADMIN ENDPOINTS - Gestion des espèces (authentification requise)
   */

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/species')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Liste admin des espèces',
    description: 'Liste complète pour l\'administration, incluant les espèces inactives.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des espèces pour l\'admin',
    type: PaginatedPlantSpeciesDto,
  })
  async getSpeciesForAdmin(@Query() searchDto: PlantSpeciesSearchDto): Promise<PaginatedPlantSpeciesDto> {
    return this.plantBibleService.findAllForAdmin(searchDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/species')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une nouvelle espèce',
    description: 'Ajouter une nouvelle espèce à la Bible des plantes.',
  })
  @ApiResponse({
    status: 201,
    description: 'Espèce créée avec succès',
    type: PlantSpeciesDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou espèce déjà existante',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise',
  })
  @ApiResponse({
    status: 403,
    description: 'Droits administrateur requis',
  })
  async createSpecies(@Body() createDto: CreatePlantSpeciesDto): Promise<PlantSpeciesDto> {
    return this.plantBibleService.createSpecies(createDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('admin/species/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Modifier une espèce',
    description: 'Mettre à jour les informations d\'une espèce existante.',
  })
  @ApiResponse({
    status: 200,
    description: 'Espèce modifiée avec succès',
    type: PlantSpeciesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Espèce non trouvée',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise',
  })
  @ApiResponse({
    status: 403,
    description: 'Droits administrateur requis',
  })
  async updateSpecies(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlantSpeciesDto,
  ): Promise<PlantSpeciesDto> {
    return this.plantBibleService.updateSpecies(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/species/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une espèce',
    description: 'Supprimer (soft delete) une espèce de la Bible des plantes.',
  })
  @ApiResponse({
    status: 204,
    description: 'Espèce supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Espèce non trouvée',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise',
  })
  @ApiResponse({
    status: 403,
    description: 'Droits administrateur requis',
  })
  async deleteSpecies(@Param('id') id: string): Promise<void> {
    return this.plantBibleService.deleteSpecies(id);
  }

  /**
   * ADMIN - Import CSV des espèces
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/species/import-csv')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(csv)$/)) {
        return callback(new Error('Seuls les fichiers CSV sont autorisés'), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Importer des espèces depuis un fichier CSV',
    description: 'Import en masse d\'espèces de plantes depuis un fichier CSV avec validation et rapport détaillé.',
  })
  @ApiResponse({
    status: 200,
    description: 'Import réalisé avec succès',
    type: CsvImportResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fichier CSV invalide ou erreurs de validation',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise',
  })
  @ApiResponse({
    status: 403,
    description: 'Droits administrateur requis',
  })
  async importCsvSpecies(
    @UploadedFile() file: Express.Multer.File,
    @Query() options: CsvImportOptionsDto,
  ): Promise<CsvImportResultDto> {
    if (!file) {
      throw new Error('Aucun fichier CSV fourni');
    }

    return this.plantBibleService.importFromCsv(file.buffer, options);
  }

  /**
   * ADMIN - Preview d'un import CSV
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/species/preview-csv')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(csv)$/)) {
        return callback(new Error('Seuls les fichiers CSV sont autorisés'), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Prévisualiser un import CSV',
    description: 'Analyse un fichier CSV et retourne un aperçu sans insertion en base.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aperçu généré avec succès',
    type: CsvImportPreviewDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fichier CSV invalide',
  })
  async previewCsvImport(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CsvImportPreviewDto> {
    if (!file) {
      throw new Error('Aucun fichier CSV fourni');
    }

    return this.plantBibleService.previewCsvImport(file.buffer);
  }

  /**
   * PUBLIC - Télécharger un template CSV
   */
  @Public()
  @Get('csv-template')
  @ApiOperation({
    summary: 'Télécharger un template CSV',
    description: 'Génère un fichier CSV template avec les colonnes et exemples.',
  })
  @ApiResponse({
    status: 200,
    description: 'Template CSV généré',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async downloadCsvTemplate(): Promise<string> {
    return this.plantBibleService.generateCsvTemplate();
  }
}