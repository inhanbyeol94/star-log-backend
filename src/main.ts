import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './_common/_utils/exceptions/filters/global.exception.filter';
import { ConfigService } from '@nestjs/config';
import { PrismaConfig } from './_common/prisma/prisma.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  PrismaConfig.LoggerInstance({
    query: true,
    error: false,
    warn: false,
    info: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validatorPackage: require('@inhanbyeol/class-validator'),
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(configService.get<number>('SERVER_PORT')!, '0.0.0.0');
}

bootstrap();
