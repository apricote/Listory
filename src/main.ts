import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import { RavenInterceptor } from "nest-raven";
import { AppModule } from "./app.module";

function setupSentry(
  app: NestExpressApplication,
  configService: ConfigService
) {
  Sentry.init({
    dsn: configService.get<string>("SENTRY_DSN"),
    integrations: [
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
  });

  app.useGlobalInterceptors(new RavenInterceptor());
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.enableShutdownHooks();

  const configService = app.get<ConfigService>(ConfigService);

  if (configService.get<boolean>("SENTRY_ENABLED")) {
    setupSentry(app, configService);
  }

  // Setup API Docs
  const options = new DocumentBuilder()
    .setTitle("Listory")
    .setDescription("Track and analyze your Spotify Listens")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("user")
    .addTag("listens")
    .addTag("auth")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);
}

bootstrap();
