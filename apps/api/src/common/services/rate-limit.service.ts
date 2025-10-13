import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private redis: Redis.RedisClientType;

  constructor(private configService: ConfigService) {
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redis = Redis.createClient({
        url: this.configService.get('REDIS_URL', 'redis://localhost:6379'),
      });

      this.redis.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
      });

      await this.redis.connect();
      this.logger.log('Connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      // Fallback: use in-memory storage (not recommended for production)
      this.redis = null;
    }
  }

  /**
   * Vérifie et met à jour le rate limit pour une adresse IP
   */
  async checkRateLimit(ip: string, identifier = 'login'): Promise<RateLimitResult> {
    const maxAttempts = parseInt(this.configService.get('LOGIN_RATE_LIMIT_MAX', '5'), 10);
    const windowMs = parseInt(this.configService.get('LOGIN_RATE_LIMIT_WINDOW_MS', '600000'), 10); // 10 min
    const key = `rate_limit:${identifier}:${ip}`;

    try {
      if (!this.redis) {
        // Fallback: always allow (not recommended for production)
        this.logger.warn('Redis not available, rate limiting disabled');
        return {
          allowed: true,
          remainingAttempts: maxAttempts,
          resetTime: new Date(Date.now() + windowMs),
        };
      }

      const currentAttempts = await this.redis.get(key);
      const attempts = currentAttempts ? parseInt(currentAttempts.toString(), 10) : 0;

      if (attempts >= maxAttempts) {
        const ttl = await this.redis.ttl(key);
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: new Date(Date.now() + (ttl * 1000)),
        };
      }

      // Incrémenter le compteur
      const newAttempts = attempts + 1;
      await this.redis.setEx(key, Math.ceil(windowMs / 1000), newAttempts.toString());

      return {
        allowed: true,
        remainingAttempts: Math.max(0, maxAttempts - newAttempts),
        resetTime: new Date(Date.now() + windowMs),
      };
    } catch (error) {
      this.logger.error(`Rate limit check failed for ${ip}:`, error);
      // En cas d'erreur Redis, on permet la requête
      return {
        allowed: true,
        remainingAttempts: maxAttempts,
        resetTime: new Date(Date.now() + windowMs),
      };
    }
  }

  /**
   * Reset le rate limit pour une IP (utile après un login réussi)
   */
  async resetRateLimit(ip: string, identifier = 'login'): Promise<void> {
    if (!this.redis) return;

    const key = `rate_limit:${identifier}:${ip}`;
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Failed to reset rate limit for ${ip}:`, error);
    }
  }

  /**
   * Ajoute une tâche en arrière-plan dans Redis (pour traitement asynchrone)
   */
  async addBackgroundTask(taskType: string, data: any, delayMs = 0): Promise<void> {
    if (!this.redis) {
      this.logger.warn('Redis not available, background task ignored');
      return;
    }

    try {
      const task = {
        type: taskType,
        data,
        createdAt: new Date().toISOString(),
        executeAt: new Date(Date.now() + delayMs).toISOString(),
      };

      await this.redis.lPush('background_tasks', JSON.stringify(task));
    } catch (error) {
      this.logger.error(`Failed to add background task ${taskType}:`, error);
    }
  }

  /**
   * Récupère et traite les tâches en arrière-plan
   */
  async processBackgroundTasks(): Promise<void> {
    if (!this.redis) return;

    try {
      const taskData = await this.redis.rPop('background_tasks');
      if (!taskData) return;

      const task = JSON.parse(taskData.toString());
      const executeAt = new Date(task.executeAt);
      const now = new Date();

      if (executeAt <= now) {
        // Traiter la tâche
        this.logger.log(`Processing background task: ${task.type}`);
        
        switch (task.type) {
          case 'send_welcome_email':
            // Sera traité par le service mail
            break;
          case 'cleanup_expired_tokens':
            // Sera traité par le service auth
            break;
          default:
            this.logger.warn(`Unknown background task type: ${task.type}`);
        }
      } else {
        // Remettre la tâche dans la queue
        await this.redis.lPush('background_tasks', taskData.toString());
      }
    } catch (error) {
      this.logger.error('Failed to process background tasks:', error);
    }
  }

  /**
   * Stocke une session utilisateur (alternative aux cookies)
   */
  async storeUserSession(sessionId: string, userId: string, expiresIn = 3600): Promise<void> {
    if (!this.redis) return;

    try {
      const sessionData = {
        userId,
        createdAt: new Date().toISOString(),
      };

      await this.redis.setEx(
        `session:${sessionId}`,
        expiresIn,
        JSON.stringify(sessionData)
      );
    } catch (error) {
      this.logger.error(`Failed to store session ${sessionId}:`, error);
    }
  }

  /**
   * Récupère une session utilisateur
   */
  async getUserSession(sessionId: string): Promise<{ userId: string; createdAt: string } | null> {
    if (!this.redis) return null;

    try {
      const sessionData = await this.redis.get(`session:${sessionId}`);
      return sessionData ? JSON.parse(sessionData.toString()) : null;
    } catch (error) {
      this.logger.error(`Failed to get session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Supprime une session utilisateur
   */
  async deleteUserSession(sessionId: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.del(`session:${sessionId}`);
    } catch (error) {
      this.logger.error(`Failed to delete session ${sessionId}:`, error);
    }
  }

  /**
   * Ferme la connexion Redis
   */
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.disconnect();
    }
  }
}