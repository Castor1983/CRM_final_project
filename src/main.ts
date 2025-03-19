import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AdminConfig, AppConfig, ClientConfig } from './configs/config.type';
import { ManagerRole } from './database/enums/managerRole.enum';
import { ManagerRepository } from './modules/repositories/services/manager.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const clientConfig = configService.get<ClientConfig>('client');
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: `http://${clientConfig.host}:${clientConfig.port}`,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('CRM programming school')
    .setDescription('The may-2024 API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 7,
    },
  });

  await app.listen(appConfig.port, async () => {
    const managerRepository = app.get<ManagerRepository>(ManagerRepository);
    const findSuperManager = await managerRepository.findOneBy({
      role: ManagerRole.ADMIN,
    });
    if (findSuperManager) {
      Logger.log('SuperAdmin found in the base');
    }
    if (!findSuperManager) {
      const config = configService.get<AdminConfig>('admin');
      const dto = {
        name: 'Admin',
        surname: 'Admin',
        email: config.email,
        password: config.password,
        is_active: true,
        role: ManagerRole.ADMIN,
      };
      const password = await bcrypt.hash(dto.password, 10);
      await managerRepository.save(
        managerRepository.create({ ...dto, password }),
      );
      Logger.log('SuperAdmin save in the base successfully');
    }
    Logger.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/api/doc`,
    );
  });
}
bootstrap();
