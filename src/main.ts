import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // App
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Services
  const configService = app.get<ConfigService>(ConfigService);

  // Inital configs
  app.enableCors({
    origin: configService.get('APP_ALLOWED_ORIGINS').split(';'),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My Gym Tracker API')
    .setDescription('**My Gym Tracker API of the My Gym Tracker application**')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(configService.get('APP_DOCS_PATH'), app, swaggerDocument);

  // Server
  const PORT = configService.get('APP_PORT') || 3000;
  const HOST = configService.get('APP_HOST') || '0.0.0.0';

  await app.listen(PORT, HOST, () => {
    console.log(`Server listening on ⚡ http://${HOST}:${PORT}`);
  });
}
bootstrap();
