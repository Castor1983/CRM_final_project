import { NestFactory } from "@nestjs/core";
import * as cors from "cors";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ManagerRole } from "./database/enums/managerRole.enum";
import { AdminConfig, AppConfig } from "./configs/config.type";
import * as bcrypt from "bcryptjs";
import { ManagerRepository } from "./modules/repositories/services/manager.repository";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>("app");
  app.setGlobalPrefix("/api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("CRM programming school")
    .setDescription("The may-2024 API description")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/doc", app, documentFactory, {
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
      Logger.log("SuperAdmin found in the base");
    }
    if (!findSuperManager) {
      const config = configService.get<AdminConfig>("admin");
      const dto = {
        name: "Admin",
        surname: "Admin",
        email: config.email,
        password: config.password,
        is_active: true,
        role: ManagerRole.ADMIN,
      };
      const password = await bcrypt.hash(dto.password, 10);
      await managerRepository.save(
        managerRepository.create({ ...dto, password }),
      );
      Logger.log("SuperAdmin save in the base successfully");
    }
    Logger.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/api/doc`,
    );
  });
}
bootstrap();
