import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.enableShutdownHooks();

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
