import { Module, OnApplicationShutdown } from "@nestjs/common";
import { OpenTelemetryModule as UpstreamModule } from "nestjs-otel";
import { otelSDK } from "./sdk";

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
  exports: [UpstreamModule],
})
export class OpenTelemetryModule implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await otelSDK.shutdown();
  }
}
