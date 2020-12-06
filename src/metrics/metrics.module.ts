import { InboundMiddleware, PromModule } from "@digikare/nestjs-prom";
import { DEFAULT_PROM_OPTIONS } from "@digikare/nestjs-prom/dist/prom.constants";
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MetricsAuthMiddleware } from "./metrics-auth.middleware";

// Dirty hack because we can not conditionally import modules based on
// injected services and upstream module does not support dynamic configuration
//
// https://github.com/digikare/nestjs-prom/issues/27
const promEnabled = process.env.PROMETHEUS_ENABLED === "true";

const METRIC_PATH = "/api/metrics";

@Module({})
export class MetricsModule implements NestModule {
  constructor(private readonly config: ConfigService) {}

  static forRoot(): DynamicModule {
    const module = {
      imports: [],
      providers: [],
    };
    if (promEnabled) {
      const promOptions = {
        metricPath: METRIC_PATH,
        withDefaultsMetrics: true,
        withDefaultController: true,
      };

      module.imports.push(PromModule.forRoot(promOptions));

      module.providers.push({
        provide: DEFAULT_PROM_OPTIONS,
        useValue: promOptions,
      });
    }

    return {
      module: MetricsModule,
      ...module,
    };
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.config.get<boolean>("PROMETHEUS_ENABLED")) {
      // We register the Middleware ourselves to avoid tracking
      // latency for static files served for the frontend.
      consumer.apply(InboundMiddleware).exclude(METRIC_PATH).forRoutes("/api");

      if (this.config.get<boolean>("PROMETHEUS_BASIC_AUTH")) {
        consumer.apply(MetricsAuthMiddleware).forRoutes(METRIC_PATH);
      }
    }
  }
}
