import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Controller("api/v1/health")
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dns: DNSHealthIndicator,
    private readonly typeorm: TypeOrmHealthIndicator,
    private readonly config: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.dns.pingCheck(
          "spotify-web",
          this.config.get<string>("SPOTIFY_WEB_API_URL")
        ),
      () =>
        this.dns.pingCheck(
          "spotify-auth",
          this.config.get<string>("SPOTIFY_AUTH_API_URL")
        ),
      () => this.typeorm.pingCheck("db"),
    ]);
  }
}
