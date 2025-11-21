import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePlantSpeciesDto, UpdatePlantSpeciesDto, PlantSpeciesDto, PlantSpeciesDetailDto, PlantSpeciesSearchDto, PaginatedPlantSpeciesDto, PlantBibleFiltersDto, CsvImportOptionsDto, CsvImportResultDto, CsvImportPreviewDto, CsvRowDto, CsvRowValidationError } from './dto/plant-species.dto';
import { parse } from 'csv-parse';
import {
  PlantEnvironmentType,
  PlantBibleCategory,
  FrenchClimate,
  DifficultyLevel,
  GrowthSpeed,
  LightRequirement,
  WateringFrequency,
  SoilTypePreference,
  SoilPHPreference,
  HumidityLevel,
  LifespanType,
  FoliageType,
  PruningType
} from '@prisma/client';

@Injectable()
export class PlantBibleService {
  private readonly logger = new Logger(PlantBibleService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Recherche et filtrage des espèces avec pagination
   */
  async searchSpecies(searchDto: PlantSpeciesSearchDto): Promise<PaginatedPlantSpeciesDto> {
    const { 
      q, 
      category, 
      plantType, 
      climate, 
      difficulty, 
      lightNeeds, 
      wateringFrequency, 
      safeForHumans, 
      safeForPets,
      page = 1, 
      pageSize = 20, 
      sort = 'name', 
      order = 'asc' 
    } = searchDto;

    const skip = (page - 1) * pageSize;
    
    // Construire les conditions de filtre
    const where: any = {
      isActive: true,
    };

    // Recherche textuelle
    if (q) {
      where.OR = [
        { commonNameFr: { contains: q, mode: 'insensitive' } },
        { latinName: { contains: q, mode: 'insensitive' } },
        { aliases: { hasSome: [q] } },
      ];
    }

    // Filtres spécifiques
    if (category) where.category = category;
    if (plantType) where.plantEnvironmentType = plantType;
    if (difficulty) where.difficultyLevel = difficulty;
    if (lightNeeds) where.lightNeeds = lightNeeds;
    if (wateringFrequency) where.wateringFrequency = wateringFrequency;
    
    // Filtres par climat français
    if (climate) {
      where.suitableClimatesFr = { has: climate };
    }

    // Filtres de sécurité
    if (safeForHumans === true) where.toxicToHumans = false;
    if (safeForPets === true) where.toxicToPets = false;

    // Tri
    const orderBy: any = {};
    switch (sort) {
      case 'name':
        orderBy.commonNameFr = order;
        break;
      case 'difficulty':
        orderBy.difficultyLevel = order;
        break;
      case 'created':
        orderBy.createdAt = order;
        break;
      default:
        orderBy.commonNameFr = 'asc';
    }

    // Exécuter la requête avec pagination
    const [species, total] = await Promise.all([
      this.prisma.plantSpecies.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        select: {
          id: true,
          slug: true,
          commonNameFr: true,
          commonNameEn: true,
          latinName: true,
          aliases: true,
          plantEnvironmentType: true,
          category: true,
          usageTags: true,
          difficultyLevel: true,
          growthSpeed: true,
          matureHeightCm: true,
          matureWidthCm: true,
          suitableClimatesFr: true,
          hardinessMinTempC: true,
          coastalTolerance: true,
          urbanTolerance: true,
          lightNeeds: true,
          wateringFrequency: true,
          wateringNotes: true,
          soilTypes: true,
          soilPh: true,
          humidityNeeds: true,
          toxicToHumans: true,
          toxicToPets: true,
          lifespanType: true,
          foliageType: true,
          notesForBeginners: true,
          seoTitle: true,
          seoDescription: true,
          images: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.plantSpecies.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: species as PlantSpeciesDto[],
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  /**
   * Récupérer une espèce par son slug
   */
  async findBySlug(slug: string): Promise<PlantSpeciesDetailDto> {
    const species = await this.prisma.plantSpecies.findUnique({
      where: { slug, isActive: true },
    });

    if (!species) {
      throw new NotFoundException(`Espèce de plante non trouvée: ${slug}`);
    }

    return species as PlantSpeciesDetailDto;
  }

  /**
   * Récupérer toutes les valeurs pour les filtres
   */
  async getFilterValues(): Promise<PlantBibleFiltersDto> {
    const { PlantBibleCategory, PlantEnvironmentType, FrenchClimate, DifficultyLevel, LightRequirement, WateringFrequency } = await import('@prisma/client');
    
    return {
      categories: Object.values(PlantBibleCategory),
      plantTypes: Object.values(PlantEnvironmentType),
      climates: Object.values(FrenchClimate),
      difficultyLevels: Object.values(DifficultyLevel),
      lightRequirements: Object.values(LightRequirement),
      wateringFrequencies: Object.values(WateringFrequency),
    };
  }

  /**
   * ADMIN - Créer une nouvelle espèce
   */
  async createSpecies(createDto: CreatePlantSpeciesDto): Promise<PlantSpeciesDto> {
    // Générer le slug depuis le nom commun français
    const slug = this.generateSlug(createDto.commonNameFr);
    
    // Vérifier l'unicité du slug
    const existing = await this.prisma.plantSpecies.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`Une espèce avec ce nom existe déjà: ${createDto.commonNameFr}`);
    }

    const species = await this.prisma.plantSpecies.create({
      data: {
        ...createDto,
        slug,
      },
      select: {
        id: true,
        slug: true,
        commonNameFr: true,
        commonNameEn: true,
        latinName: true,
        aliases: true,
        plantEnvironmentType: true,
        category: true,
        usageTags: true,
        difficultyLevel: true,
        growthSpeed: true,
        matureHeightCm: true,
        matureWidthCm: true,
        suitableClimatesFr: true,
        hardinessMinTempC: true,
        coastalTolerance: true,
        urbanTolerance: true,
        lightNeeds: true,
        wateringFrequency: true,
        wateringNotes: true,
        soilTypes: true,
        soilPh: true,
        humidityNeeds: true,
        lifespanType: true,
        foliageType: true,
        notesForBeginners: true,
        seoTitle: true,
        seoDescription: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return species as PlantSpeciesDto;
  }

  /**
   * ADMIN - Modifier une espèce
   */
  async updateSpecies(id: string, updateDto: UpdatePlantSpeciesDto): Promise<PlantSpeciesDto> {
    const existing = await this.prisma.plantSpecies.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Espèce non trouvée: ${id}`);
    }

    // Regénérer le slug si le nom a changé
    let slug = existing.slug;
    if (updateDto.commonNameFr && updateDto.commonNameFr !== existing.commonNameFr) {
      slug = this.generateSlug(updateDto.commonNameFr);
      
      // Vérifier l'unicité du nouveau slug
      const slugExists = await this.prisma.plantSpecies.findFirst({
        where: { slug, id: { not: id } },
      });

      if (slugExists) {
        throw new BadRequestException(`Une espèce avec ce nom existe déjà: ${updateDto.commonNameFr}`);
      }
    }

    const species = await this.prisma.plantSpecies.update({
      where: { id },
      data: {
        ...updateDto,
        slug,
      },
      select: {
        id: true,
        slug: true,
        commonNameFr: true,
        commonNameEn: true,
        latinName: true,
        aliases: true,
        plantEnvironmentType: true,
        category: true,
        usageTags: true,
        difficultyLevel: true,
        growthSpeed: true,
        matureHeightCm: true,
        matureWidthCm: true,
        suitableClimatesFr: true,
        hardinessMinTempC: true,
        coastalTolerance: true,
        urbanTolerance: true,
        lightNeeds: true,
        wateringFrequency: true,
        wateringNotes: true,
        soilTypes: true,
        soilPh: true,
        humidityNeeds: true,
        lifespanType: true,
        foliageType: true,
        notesForBeginners: true,
        seoTitle: true,
        seoDescription: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return species as PlantSpeciesDto;
  }

  /**
   * ADMIN - Supprimer une espèce
   */
  async deleteSpecies(id: string): Promise<void> {
    const species = await this.prisma.plantSpecies.findUnique({
      where: { id },
    });

    if (!species) {
      throw new NotFoundException(`Espèce non trouvée: ${id}`);
    }

    // Soft delete
    await this.prisma.plantSpecies.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * ADMIN - Liste pour l'administration
   */
  async findAllForAdmin(searchDto: PlantSpeciesSearchDto): Promise<PaginatedPlantSpeciesDto> {
    // Similaire à searchSpecies mais sans le filtre isActive pour voir toutes les espèces
    const modifiedSearch = { ...searchDto };
    delete (modifiedSearch as any).isActive;
    
    const result = await this.searchSpecies(modifiedSearch);
    return result;
  }

  /**
   * Génère un slug URL-friendly depuis le nom commun
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // supprimer caractères spéciaux
      .replace(/\s+/g, '-') // espaces vers tirets
      .replace(/-+/g, '-') // tirets multiples vers un seul
      .replace(/^-|-$/g, ''); // supprimer tirets au début/fin
  }

  /**
   * Import d'espèces depuis un fichier CSV
   */
  async importFromCsv(
    csvBuffer: Buffer,
    options: CsvImportOptionsDto
  ): Promise<CsvImportResultDto> {
    const startTime = Date.now();
    const result: CsvImportResultDto = {
      totalRows: 0,
      successful: 0,
      updated: 0,
      errors: 0,
      warnings: 0,
      processingTime: 0,
      previewMode: options.previewOnly || false,
      details: [],
      speciesIds: [],
    };

    try {
      const csvData = await this.parseCsv(csvBuffer);
      result.totalRows = csvData.length;

      this.logger.log(`Début import CSV: ${result.totalRows} lignes trouvées`);

      if (options.previewOnly) {
        // Mode preview : validation uniquement
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          const validation = await this.validateCsvRow(row, i + 2); // +2 car header + index 0
          
          if (validation.length > 0) {
            result.errors += validation.length;
            result.details.push(...validation);
          } else {
            result.successful++;
          }

          if (options.strictMode && validation.length > 0) {
            break;
          }
        }
      } else {
        // Mode import réel avec transaction
        await this.prisma.$transaction(async (prisma) => {
          for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            const lineNumber = i + 2;

            try {
              const validation = await this.validateCsvRow(row, lineNumber);
              
              if (validation.length > 0) {
                result.errors += validation.length;
                result.details.push(...validation);
                
                if (options.strictMode) {
                  throw new BadRequestException('Import arrêté en mode strict');
                }
                continue;
              }

              const speciesData = this.transformCsvRowToSpecies(row);
              
              // Vérifier si l'espèce existe déjà
              const existingSpecies = await prisma.plantSpecies.findFirst({
                where: {
                  OR: [
                    { commonNameFr: speciesData.commonNameFr },
                    { latinName: speciesData.latinName },
                  ],
                },
              });

              let speciesId: string;

              if (existingSpecies) {
                if (options.updateExisting) {
                  // Mise à jour
                  const updated = await prisma.plantSpecies.update({
                    where: { id: existingSpecies.id },
                    data: speciesData,
                  });
                  speciesId = updated.id;
                  result.updated++;
                } else {
                  // Ignorer les doublons
                  result.details.push({
                    line: lineNumber,
                    field: 'duplicate',
                    message: `Espèce déjà existante: ${speciesData.commonNameFr}`,
                    value: speciesData.commonNameFr,
                  });
                  result.warnings++;
                  continue;
                }
              } else {
                // Création
                const slug = this.generateSlug(speciesData.commonNameFr);
                const created = await prisma.plantSpecies.create({
                  data: {
                    ...speciesData,
                    slug,
                  },
                });
                speciesId = created.id;
                result.successful++;
              }

              result.speciesIds.push(speciesId);

            } catch (error) {
              this.logger.error(`Erreur ligne ${lineNumber}:`, error);
              result.errors++;
              result.details.push({
                line: lineNumber,
                field: 'general',
                message: error.message || 'Erreur inconnue',
                value: row,
              });

              if (options.strictMode) {
                throw error;
              }
            }
          }
        });
      }

      result.processingTime = Date.now() - startTime;
      
      this.logger.log(`Import terminé: ${result.successful} succès, ${result.errors} erreurs, ${result.warnings} avertissements`);
      
      return result;

    } catch (error) {
      this.logger.error('Erreur lors de l\'import CSV:', error);
      throw new BadRequestException(`Erreur lors de l'import: ${error.message}`);
    }
  }

  /**
   * Preview d'un import CSV
   */
  async previewCsvImport(csvBuffer: Buffer): Promise<CsvImportPreviewDto> {
    try {
      const csvData = await this.parseCsv(csvBuffer);
      
      // Analyser les colonnes
      const sampleRow = csvData[0] || {};
      const detectedColumns = Object.keys(sampleRow);
      const requiredColumns = this.getRequiredCsvColumns();
      const expectedColumns = this.getAllCsvColumns();
      
      const missingRequiredColumns = requiredColumns.filter(
        col => !detectedColumns.includes(col)
      );
      
      const unknownColumns = detectedColumns.filter(
        col => !expectedColumns.includes(col)
      );

      // Échantillon des 5 premières lignes
      const sampleRows = csvData.slice(0, 5);
      
      // Validation des erreurs sur l'échantillon
      const validationErrors: CsvRowValidationError[] = [];
      for (let i = 0; i < Math.min(5, csvData.length); i++) {
        const errors = await this.validateCsvRow(csvData[i], i + 2);
        validationErrors.push(...errors);
      }

      return {
        sampleRows,
        detectedColumns,
        missingRequiredColumns,
        unknownColumns,
        estimatedRows: csvData.length,
        validationErrors,
      };

    } catch (error) {
      throw new BadRequestException(`Erreur lors de la preview: ${error.message}`);
    }
  }

  /**
   * Génère un template CSV
   */
  async generateCsvTemplate(): Promise<string> {
    const headers = [
      'nom_commun_fr', 'nom_commun_en', 'nom_latin', 'aliases',
      'type_environnement', 'categorie', 'tags_usage', 'difficulte', 'vitesse_croissance',
      'hauteur_cm', 'largeur_cm', 'climats_fr', 'temp_min_c',
      'tolerance_cotiere', 'tolerance_urbaine', 'besoins_lumiere', 'frequence_arrosage', 'notes_arrosage',
      'types_sol', 'ph_sol', 'humidite', 'duree_vie', 'type_feuillage', 'type_taille',
      'notes_debutants', 'toxique_humains', 'toxique_animaux'
    ];

    const exampleRow = [
      'Lavande vraie', 'True Lavender', 'Lavandula angustifolia', 'Lavande officinale;Lavande fine',
      'OUTDOOR', 'SHRUB', 'aromatique;decorative', 'VERY_EASY', 'MEDIUM',
      '80', '80', 'MEDITERRANEAN;OCEANIC', '-15',
      'true', 'true', 'FULL_SUN', 'VERY_LOW', 'Arrosage très rare',
      'SANDY;WELL_DRAINED', 'BASIC', 'LOW', 'PERENNIAL', 'EVERGREEN', 'LIGHT',
      'Très facile à cultiver', 'false', 'false'
    ];

    const csvLines = [
      headers.join(','),
      exampleRow.join(','),
    ];

    return csvLines.join('\n');
  }

  /**
   * Parse le CSV et retourne un array d'objets
   */
  private async parseCsv(csvBuffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const csvString = csvBuffer.toString('utf-8');

      parse(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
      }, (err, records) => {
        if (err) {
          reject(new Error(`Erreur de parsing CSV: ${err.message}`));
        } else {
          resolve(records);
        }
      });
    });
  }

  /**
   * Valide une ligne CSV
   */
  private async validateCsvRow(row: any, lineNumber: number): Promise<CsvRowValidationError[]> {
    const errors: CsvRowValidationError[] = [];

    // Validations obligatoires
    if (!row.nom_commun_fr?.trim()) {
      errors.push({
        line: lineNumber,
        field: 'nom_commun_fr',
        message: 'Le nom commun français est obligatoire',
        value: row.nom_commun_fr,
      });
    }

    if (!row.nom_latin?.trim()) {
      errors.push({
        line: lineNumber,
        field: 'nom_latin',
        message: 'Le nom latin est obligatoire',
        value: row.nom_latin,
      });
    }

    // Validation des enums
    const enumValidations = [
      { field: 'type_environnement', value: row.type_environnement, enum: PlantEnvironmentType },
      { field: 'categorie', value: row.categorie, enum: PlantBibleCategory },
      { field: 'difficulte', value: row.difficulte, enum: DifficultyLevel },
      { field: 'vitesse_croissance', value: row.vitesse_croissance, enum: GrowthSpeed },
      { field: 'besoins_lumiere', value: row.besoins_lumiere, enum: LightRequirement },
      { field: 'frequence_arrosage', value: row.frequence_arrosage, enum: WateringFrequency },
      { field: 'humidite', value: row.humidite, enum: HumidityLevel },
      { field: 'duree_vie', value: row.duree_vie, enum: LifespanType },
      { field: 'type_feuillage', value: row.type_feuillage, enum: FoliageType },
      { field: 'type_taille', value: row.type_taille, enum: PruningType },
    ];

    for (const validation of enumValidations) {
      if (validation.value && !Object.values(validation.enum).includes(validation.value)) {
        errors.push({
          line: lineNumber,
          field: validation.field,
          message: `Valeur invalide. Valeurs acceptées: ${Object.values(validation.enum).join(', ')}`,
          value: validation.value,
        });
      }
    }

    // Validation des arrays (climats, types de sol)
    if (row.climats_fr) {
      const climates = row.climats_fr.split(';').map(c => c.trim());
      for (const climate of climates) {
        if (!Object.values(FrenchClimate).includes(climate as FrenchClimate)) {
          errors.push({
            line: lineNumber,
            field: 'climats_fr',
            message: `Climat invalide: ${climate}. Valeurs acceptées: ${Object.values(FrenchClimate).join(', ')}`,
            value: climate,
          });
        }
      }
    }

    if (row.types_sol) {
      const soilTypes = row.types_sol.split(';').map(s => s.trim());
      for (const soilType of soilTypes) {
        if (!Object.values(SoilTypePreference).includes(soilType as SoilTypePreference)) {
          errors.push({
            line: lineNumber,
            field: 'types_sol',
            message: `Type de sol invalide: ${soilType}. Valeurs acceptées: ${Object.values(SoilTypePreference).join(', ')}`,
            value: soilType,
          });
        }
      }
    }

    // Validation des nombres
    if (row.hauteur_cm && isNaN(Number(row.hauteur_cm))) {
      errors.push({
        line: lineNumber,
        field: 'hauteur_cm',
        message: 'La hauteur doit être un nombre',
        value: row.hauteur_cm,
      });
    }

    if (row.largeur_cm && isNaN(Number(row.largeur_cm))) {
      errors.push({
        line: lineNumber,
        field: 'largeur_cm',
        message: 'La largeur doit être un nombre',
        value: row.largeur_cm,
      });
    }

    return errors;
  }

  /**
   * Transforme une ligne CSV en objet CreatePlantSpeciesDto
   */
  private transformCsvRowToSpecies(row: any): CreatePlantSpeciesDto {
    return {
      commonNameFr: row.nom_commun_fr?.trim(),
      commonNameEn: row.nom_commun_en?.trim() || undefined,
      latinName: row.nom_latin?.trim(),
      aliases: row.aliases ? row.aliases.split(';').map(a => a.trim()).filter(a => a) : undefined,
      plantEnvironmentType: row.type_environnement as PlantEnvironmentType,
      category: row.categorie as PlantBibleCategory,
      usageTags: row.tags_usage ? row.tags_usage.split(';').map(t => t.trim()).filter(t => t) : undefined,
      difficultyLevel: row.difficulte as DifficultyLevel,
      growthSpeed: row.vitesse_croissance as GrowthSpeed,
      matureHeightCm: row.hauteur_cm ? Number(row.hauteur_cm) : undefined,
      matureWidthCm: row.largeur_cm ? Number(row.largeur_cm) : undefined,
      suitableClimatesFr: row.climats_fr ? row.climats_fr.split(';').map(c => c.trim() as FrenchClimate) : [],
      hardinessMinTempC: row.temp_min_c ? Number(row.temp_min_c) : undefined,
      coastalTolerance: row.tolerance_cotiere ? row.tolerance_cotiere === 'true' : undefined,
      urbanTolerance: row.tolerance_urbaine ? row.tolerance_urbaine === 'true' : undefined,
      lightNeeds: row.besoins_lumiere as LightRequirement,
      wateringFrequency: row.frequence_arrosage as WateringFrequency,
      wateringNotes: row.notes_arrosage?.trim() || undefined,
      soilTypes: row.types_sol ? row.types_sol.split(';').map(s => s.trim() as SoilTypePreference) : [],
      soilPh: row.ph_sol as SoilPHPreference || undefined,
      humidityNeeds: row.humidite as HumidityLevel,
      lifespanType: row.duree_vie as LifespanType,
      foliageType: row.type_feuillage as FoliageType,
      pruningType: row.type_taille as PruningType,
      notesForBeginners: row.notes_debutants?.trim() || undefined,
      seoTitle: undefined,
      seoDescription: undefined,
    };
  }

  /**
   * Retourne la liste des colonnes obligatoires
   */
  private getRequiredCsvColumns(): string[] {
    return [
      'nom_commun_fr', 'nom_latin', 'type_environnement', 'categorie',
      'difficulte', 'vitesse_croissance', 'climats_fr', 'besoins_lumiere',
      'frequence_arrosage', 'types_sol', 'humidite', 'duree_vie',
      'type_feuillage', 'type_taille'
    ];
  }

  /**
   * Retourne toutes les colonnes CSV acceptées
   */
  private getAllCsvColumns(): string[] {
    return [
      'nom_commun_fr', 'nom_commun_en', 'nom_latin', 'aliases',
      'type_environnement', 'categorie', 'tags_usage', 'difficulte', 'vitesse_croissance',
      'hauteur_cm', 'largeur_cm', 'climats_fr', 'temp_min_c',
      'tolerance_cotiere', 'tolerance_urbaine', 'besoins_lumiere', 'frequence_arrosage', 'notes_arrosage',
      'types_sol', 'ph_sol', 'humidite', 'duree_vie', 'type_feuillage', 'type_taille',
      'notes_debutants', 'toxique_humains', 'toxique_animaux'
    ];
  }
}