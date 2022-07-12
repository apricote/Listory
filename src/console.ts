import { repl } from "@nestjs/core";
import { AppModule } from "./app.module";
import { otelSDK } from "./open-telemetry/sdk";

async function bootstrap() {
  await otelSDK.start();

  // TODO: Disable scheduled tasks from SourcesModule when in repl mode
  await repl(AppModule);
}
bootstrap();
