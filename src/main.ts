import { otelSDK } from "./open-telemetry/sdk"; // needs to be loaded first - always -
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { context, trace } from "@opentelemetry/api";
import * as Sentry from "@sentry/node";
import { RavenInterceptor } from "nest-raven";
import Pino from "pino";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { Scope } from "@sentry/node";

const logger = Pino({
  formatters: {
    log(object) {
      const span = trace.getSpan(context.active());
      if (!span) return { ...object };
      const { spanId, traceId } = span.spanContext();
      return { ...object, spanId, traceId };
    },
  },
});

// @ts-expect-error
logger.log = logger.info;

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

  app.useGlobalInterceptors(
    new RavenInterceptor({
      transformers: [
        (scope: Scope) => {
          const span = trace.getSpan(context.active());
          if (span) {
            const { spanId, traceId } = span.spanContext();
            scope.setContext("trace", { span_id: spanId, trace_id: traceId });
          }
        },
      ],
    })
  );
}

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
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
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);
}

bootstrap();
