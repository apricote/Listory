import { Global, Module, OnApplicationShutdown } from "@nestjs/common";
import { OpenTelemetryModule as UpstreamModule } from "nestjs-otel";
import { otelSDK } from "./sdk";
import { UrlValueParserService } from "./url-value-parser.service";

@Module({
  imports: [
    UpstreamModule.forRoot({
      metrics: {
        hostMetrics: true, // Includes Host Metrics
        defaultMetrics: true, // Includes Default Metrics
        apiMetrics: {
          enable: true, // Includes api metrics
          timeBuckets: [], // You can change the default time buckets
          ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
        },
      },
    }),
  ],
  providers: [UrlValueParserService],
  exports: [UpstreamModule, UrlValueParserService],
})
@Global()
export class OpenTelemetryModule implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await otelSDK.shutdown();
  }
}
