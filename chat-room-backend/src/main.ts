import { NestFactory } from '@nestjs/core';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'error',
        dirname: 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: path.join('logs'),

        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
  const logger = WinstonModule.createLogger({ instance });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.enableCors();

  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  await app.listen(3009);
}
bootstrap();
