import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { configureScope, Scope } from "@sentry/node";

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
      () =>
        this.http.pingCheck(
          "spotify-auth",
          this.config.get<string>("SPOTIFY_AUTH_API_URL")
        ),
      () => this.typeorm.pingCheck("db"),
    ]);

    configureScope((scope: Scope) => {
      scope.setExtra("health", health);
    });

    return health;
  }
}
