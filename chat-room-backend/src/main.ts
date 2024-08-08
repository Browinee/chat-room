import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new I18nValidationPipe({ transform: true}));
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false
  }));

  await app.listen(3009);
}
bootstrap();
