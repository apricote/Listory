import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { configureScope, Scope } from "@sentry/node";

@ApiTags("health")
@Controller("api/v1/health")
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly typeorm: TypeOrmHealthIndicator,
    private readonly config: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const health = await this.health.check([
      () =>
        this.http.pingCheck(
          "spotify-web",
          this.config.get<string>("SPOTIFY_WEB_API_URL")
        ),
      () => this.typeorm.pingCheck("db"),
    ]);

    configureScope((scope: Scope) => {
      scope.setContext("health", {
        status: health.status,
        info: health.info,
        error: health.error,
      });
    });

    return health;
  }
}
