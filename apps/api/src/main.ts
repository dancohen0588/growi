import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  
  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL', 'http://localhost:3001'),
      configService.get('ADMIN_URL', 'http://localhost:3001'),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // API prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Growi API')
      .setDescription('Assistant de jardinage intelligent - API REST')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
          description: 'API Key for organization access',
        },
        'api-key',
      )
      .addServer(`http://localhost:${configService.get('API_PORT', 3000)}`, 'Development')
      .addTag('auth', 'Authentication & Authorization')
      .addTag('users', 'User management')
      .addTag('organizations', 'Organization management (B2B)')
      .addTag('gardens', 'Garden projects & zones')
      .addTag('plants', 'Plants catalog')
      .addTag('user-plants', 'User plant instances')
      .addTag('tasks', 'Tasks & reminders')
      .addTag('diagnosis', 'Plant diagnosis & AI')
      .addTag('weather', 'Weather data')
      .addTag('store', 'Products & store')
      .addTag('services', 'Services marketplace (B2B)')
      .addTag('orders', 'Orders & cart')
      .addTag('work-orders', 'Work orders (B2B)')
      .addTag('notifications', 'Notifications')
      .addTag('admin', 'Admin endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(`📚 Swagger documentation: http://localhost:${configService.get('API_PORT', 3000)}/docs`);
  }

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });

  const port = configService.get('API_PORT', 3000);
  await app.listen(port);
  
  console.log(`🌱 Growi API is running on: http://localhost:${port}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});