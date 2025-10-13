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

    // Logging sera ajouté après la génération correcte des types Prisma
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
        authorCount,
        categoryCount,
        articleCount,
        tagCount,
        mediaCount,
      ] = await Promise.all([
        this.author.count(),
        this.category.count(),
        this.article.count(),
        this.tag.count(),
        this.media.count(),
      ]);

      return {
        authors: authorCount,
        categories: categoryCount,
        articles: articleCount,
        tags: tagCount,
        media: mediaCount,
      };
    } catch (error) {
      this.logger.error('Failed to get database stats:', error);
      return null;
    }
  }
}