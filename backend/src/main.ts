import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Runs class-validator decorators from every DTO automatically on
  // incoming requests. whitelist strips any fields not defined on the
  // DTO; forbidNonWhitelisted rejects the request outright if the
  // client sends unexpected fields, instead of silently ignoring them.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Normalizes every error response into one consistent shape
  // (see http-exception.filter.ts).
  app.useGlobalFilters(new HttpExceptionFilter());

  // Only the frontend origin(s) listed in CORS_ORIGIN may call this API.
  // Supports a comma-separated list so both a local dev URL and the
  // deployed Vercel URL can be allowed at once.
  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Render assigns its own PORT via env var in production; 3001 is
  // just the local/default fallback.
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`Backend running on port ${port}`);
}

bootstrap();
