import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    I18nModule.forRoot({
      fallbackLanguage: 'zh',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(["x-custom-lang"])

      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
