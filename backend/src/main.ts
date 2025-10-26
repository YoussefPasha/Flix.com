import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global API prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Flix CMS API')
    .setDescription(
      'Content Management System API for Flix streaming platform\n\n' +
        '## API Versioning\n' +
        'This API uses URI-based versioning. Current version: v1\n' +
        'All endpoints are prefixed with `/api/v1/`\n\n' +
        '### Version History\n' +
        '- **v1** (Current): Initial API release',
    )
    .setVersion('1.0')
    .addTag('Content', 'Content management endpoints')
    .addTag('Genres', 'Genre management endpoints')
    .addTag('Tags', 'Tag management endpoints')
    .addTag('Cast & Crew', 'Cast and crew management endpoints')
    .addTag('Ratings', 'Content rating endpoints')
    .addTag('Reviews', 'Content review endpoints')
    .addTag('Search', 'Content search and discovery endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs\n`,
  );
}
void bootstrap();
