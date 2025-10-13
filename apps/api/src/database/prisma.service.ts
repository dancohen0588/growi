import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e) => {
      this.logger.error(`Database error: ${e.message}`);
    });

    this.$on('warn', (e) => {
      this.logger.warn(`Database warning: ${e.message}`);
    });

    this.$on('info', (e) => {
      this.logger.log(`Database info: ${e.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('📴 Database disconnected');
  }

  // Utility method to handle transactions
  async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  // Soft delete helper
  async softDelete(model: any, where: any) {
    return model.update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const [
        userCount,
        organizationCount,
        gardenProjectCount,
        plantCount,
        taskCount,
        orderCount,
      ] = await Promise.all([
        this.user.count({ where: { deletedAt: null } }),
        this.organization.count(),
        this.gardenProject.count(),
        this.plant.count(),
        this.task.count(),
        this.order.count(),
      ]);

      return {
        users: userCount,
        organizations: organizationCount,
        gardenProjects: gardenProjectCount,
        plants: plantCount,
        tasks: taskCount,
        orders: orderCount,
      };
    } catch (error) {
      this.logger.error('Failed to get database stats:', error);
      return null;
    }
  }
}