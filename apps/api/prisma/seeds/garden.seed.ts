import { PrismaClient } from '@prisma/client';
import {
  KnowledgeLevel,
  MainObjective,
  EnvironmentType,
  SoilType,
  SoilPh,
  Orientation,
  Slope,
  Drainage,
  IrrigationType,
  Exposure,
  PlantType,
  PlantCycle,
  WaterNeed,
  ActivityType,
  ReminderStatus,
  DataSource,
  BudgetRange,
  ProductionUse,
} from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGardenData() {
  console.log('🌱 Seeding garden data...');

  // Find or create test user
  let testUser = await prisma.user.findUnique({
    where: { email: 'test@growi.io' },
  });

  if (!testUser) {
    console.log('Creating test user...');
    testUser = await prisma.user.create({
      data: {
        email: 'test@growi.io',
        passwordHash: '$2b$10$example.hash.for.testing',
        firstName: 'Marie',
        lastName: 'Dupont',
      },
    });
  }

  // Create user profile
  let userProfile = await prisma.userProfile.findUnique({
    where: { userId: testUser.id },
  });

  if (!userProfile) {
    console.log('Creating user profile...');
    userProfile = await prisma.userProfile.create({
      data: {
        userId: testUser.id,
        knowledgeLevel: KnowledgeLevel.INTERMEDIATE,
        mainObjective: MainObjective.PRODUCTIVE_GARDEN,
        timePerWeekMinutes: 180, // 3 hours per week
        budgetRange: BudgetRange.MEDIUM,
        budgetMonthlyEstimate: 75.0,
        tools: ['bêche', 'sécateur', 'arrosoir', 'râteau'],
        hasIrrigation: true,
        hasMower: false,
        hasCompost: true,
        hasProfessionalGardener: false,
        constraints: ['absences estivales'],
        productionUse: ProductionUse.SELF_CONSUMPTION,
        environmentType: EnvironmentType.HOUSE,
      },
    });
  }

  // Create garden project
  let gardenProject = await prisma.gardenProject.findFirst({
    where: { userId: testUser.id },
  });

  if (!gardenProject) {
    console.log('Creating garden project...');
    gardenProject = await prisma.gardenProject.create({
      data: {
        userId: testUser.id,
        name: 'Mon jardin principal',
        description: 'Jardin familial avec potager et espace détente',
        coverImageUrl: '/images/garden-cover.jpg',
      },
    });
  }

  // Create garden
  let garden = await prisma.garden.findFirst({
    where: { projectId: gardenProject.id },
  });

  if (!garden) {
    console.log('Creating garden...');
    garden = await prisma.garden.create({
      data: {
        projectId: gardenProject.id,
        userId: testUser.id,
        name: 'Jardin arrière',
        city: 'Lyon',
        postalCode: '69000',
        country: 'FR',
        latitude: 45.7640,
        longitude: 4.8357,
        totalAreaM2: 150.0,
        soilType: SoilType.LOAMY,
        soilPh: SoilPh.NEUTRAL,
        exposureMain: Orientation.SOUTH,
        slope: Slope.SLIGHT,
        drainage: Drainage.NORMAL,
        hasWaterPoint: true,
        irrigationType: IrrigationType.DRIP,
        hasPets: false,
        hasVegetableGarden: true,
        hasOrchard: false,
        hasGreenhouse: false,
        environmentType: EnvironmentType.HOUSE,
        planWidthPx: 800,
        planHeightPx: 600,
      },
    });
  }

  // Create garden zones
  const zones = await prisma.gardenZone.findMany({
    where: { gardenId: garden.id },
  });

  if (zones.length === 0) {
    console.log('Creating garden zones...');
    
    const potagerZone = await prisma.gardenZone.create({
      data: {
        gardenId: garden.id,
        name: 'Potager',
        exposure: Exposure.FULL_SUN,
        shadePercent: 10,
        shape: {
          type: 'polygon',
          coordinates: [[0.1, 0.1], [0.6, 0.1], [0.6, 0.4], [0.1, 0.4], [0.1, 0.1]]
        },
        overrideSoilType: SoilType.LOAMY,
      },
    });

    const flowerZone = await prisma.gardenZone.create({
      data: {
        gardenId: garden.id,
        name: 'Massif floral',
        exposure: Exposure.PART_SHADE,
        shadePercent: 30,
        shape: {
          type: 'polygon',
          coordinates: [[0.7, 0.1], [0.9, 0.1], [0.9, 0.6], [0.7, 0.6], [0.7, 0.1]]
        },
      },
    });

    // Create plants
    console.log('Creating plants...');
    
    // Vegetables in potager
    await prisma.plant.create({
      data: {
        gardenId: garden.id,
        zoneId: potagerZone.id,
        scientificName: 'Solanum lycopersicum',
        commonName: 'Tomates cerises',
        plantType: PlantType.VEGETABLE,
        cycle: PlantCycle.ANNUAL,
        plantedAt: new Date('2024-04-15'),
        estimatedAgeMonths: 6,
        location: {
          type: 'point',
          coordinates: [0.3, 0.2]
        },
        exposure: Exposure.FULL_SUN,
        waterNeed: WaterNeed.HIGH,
        wateringFrequencyDays: 2,
        wateringType: IrrigationType.DRIP,
        substrate: 'Terre de jardin enrichie compost',
        photosUrls: ['/images/tomates-cerises-1.jpg'],
        isAlive: true,
        notes: 'Variété très productive, récolte depuis juillet',
      },
    });

    await prisma.plant.create({
      data: {
        gardenId: garden.id,
        zoneId: potagerZone.id,
        scientificName: 'Lactuca sativa',
        commonName: 'Laitues batavia',
        plantType: PlantType.VEGETABLE,
        cycle: PlantCycle.ANNUAL,
        plantedAt: new Date('2024-03-20'),
        estimatedAgeMonths: 7,
        location: {
          type: 'point',
          coordinates: [0.4, 0.3]
        },
        exposure: Exposure.PART_SHADE,
        waterNeed: WaterNeed.MEDIUM,
        wateringFrequencyDays: 3,
        wateringType: IrrigationType.MANUAL,
        substrate: 'Terre de jardin',
        photosUrls: [],
        isAlive: true,
        notes: 'Succession de plantations toutes les 2 semaines',
      },
    });

    // Flowers in flower zone
    await prisma.plant.create({
      data: {
        gardenId: garden.id,
        zoneId: flowerZone.id,
        scientificName: 'Lavandula angustifolia',
        commonName: 'Lavande vraie',
        plantType: PlantType.SHRUB,
        cycle: PlantCycle.PERENNIAL,
        plantedAt: new Date('2023-09-10'),
        estimatedAgeMonths: 13,
        location: {
          type: 'point',
          coordinates: [0.8, 0.3]
        },
        exposure: Exposure.FULL_SUN,
        waterNeed: WaterNeed.LOW,
        wateringFrequencyDays: 7,
        wateringType: IrrigationType.MANUAL,
        substrate: 'Terre drainante',
        photosUrls: ['/images/lavande-1.jpg', '/images/lavande-2.jpg'],
        isAlive: true,
        notes: 'Taille après floraison, très résistante',
      },
    });

    // Create some activities
    console.log('Creating activities...');
    
    const tomatoes = await prisma.plant.findFirst({
      where: { commonName: 'Tomates cerises' },
    });

    if (tomatoes) {
      await prisma.activity.create({
        data: {
          userId: testUser.id,
          gardenId: garden.id,
          plantId: tomatoes.id,
          type: ActivityType.WATERING,
          occurredAt: new Date('2024-10-13T08:30:00Z'),
          quantity: 2.0,
          unit: 'litres',
          notes: 'Arrosage matinal avant la chaleur',
          photoUrls: [],
        },
      });

      await prisma.activity.create({
        data: {
          userId: testUser.id,
          gardenId: garden.id,
          plantId: tomatoes.id,
          type: ActivityType.HARVEST,
          occurredAt: new Date('2024-10-12T18:00:00Z'),
          quantity: 0.8,
          unit: 'kg',
          notes: 'Belle récolte de tomates bien mûres',
          photoUrls: ['/images/harvest-tomatoes.jpg'],
        },
      });
    }

    const lavender = await prisma.plant.findFirst({
      where: { commonName: 'Lavande vraie' },
    });

    if (lavender) {
      await prisma.activity.create({
        data: {
          userId: testUser.id,
          gardenId: garden.id,
          plantId: lavender.id,
          type: ActivityType.PRUNING,
          occurredAt: new Date('2024-08-20T09:00:00Z'),
          notes: 'Taille post-floraison pour maintenir la forme',
          photoUrls: [],
        },
      });
    }

    // Create reminders
    console.log('Creating reminders...');
    
    if (tomatoes) {
      await prisma.reminder.create({
        data: {
          userId: testUser.id,
          gardenId: garden.id,
          plantId: tomatoes.id,
          title: 'Arroser les tomates',
          description: 'Vérifier l\'humidité du sol et arroser si nécessaire',
          status: ReminderStatus.PENDING,
          nextAt: new Date('2024-10-15T08:00:00Z'),
          rrule: 'FREQ=DAILY;INTERVAL=2', // Every 2 days
        },
      });
    }

    await prisma.reminder.create({
      data: {
        userId: testUser.id,
        gardenId: garden.id,
        title: 'Préparer le sol pour l\'hiver',
        description: 'Nettoyer les parcelles et ajouter du compost',
        status: ReminderStatus.PENDING,
        nextAt: new Date('2024-11-01T10:00:00Z'),
      },
    });

    // Create environmental snapshot
    console.log('Creating environmental snapshot...');
    
    await prisma.environmentalSnapshot.create({
      data: {
        gardenId: garden.id,
        recordedAt: new Date('2024-10-14T06:00:00Z'),
        tempMinC: 8.5,
        tempMaxC: 18.2,
        tempAvgC: 13.4,
        soilHumidityPct: 65.0,
        uvIndex: 4.2,
        rainfallMm: 2.1,
        frostRisk: false,
        windSpeedKph: 12.0,
        sunshineHours: 6.5,
        source: DataSource.API,
        raw: {
          provider: 'openweathermap',
          location: 'Lyon, FR',
          timestamp: '2024-10-14T06:00:00Z'
        },
      },
    });
  }

  console.log('✅ Garden data seeded successfully!');
}

// Run if called directly
if (require.main === module) {
  seedGardenData()
    .catch((e) => {
      console.error('Error seeding garden data:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}