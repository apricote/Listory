import { InboundMiddleware, PromModule } from "@digikare/nestjs-prom";
import { DEFAULT_PROM_OPTIONS } from "@digikare/nestjs-prom/dist/prom.constants";
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";

// Dirty hack because we can not conditionally import modules based on
// injected services and upstream module does not support dynamic configuration
//
// https://github.com/digikare/nestjs-prom/issues/27
const promEnabled = process.env.PROMETHEUS_ENABLED === "true";

@Module({})
export class MetricsModule implements NestModule {
  static forRoot(): DynamicModule {
    const module = {
      imports: [],
      providers: [],
    };
    if (promEnabled) {
      const promOptions = {
        metricPath: "/api/metrics",
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
    if (promEnabled) {
      // We register the Middleware ourselves to avoid tracking
      // latency for static files served for the frontend.
      consumer.apply(InboundMiddleware).forRoutes("/api");
    }
  }
}
