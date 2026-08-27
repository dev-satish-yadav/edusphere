// Must load before AppModule: its decorators read process.env at import time.
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  for (const key of ['JWT_SECRET', 'ADMIN_API_KEY', 'MONGODB_URI']) {
    if (!process.env[key]) throw new Error(`${key} is required, see .env.example`);
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  //Add validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Nestjs API')
      .setDescription('API list of user, admin and error log')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: 'Paste the token returned by POST /api/admin/login',
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        // This name matters: it matches @ApiBearerAuth('access-token') on the routes.
        'access-token',
      )
      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        // Matches @ApiSecurity('api-key') on admin create.
        'api-key',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
