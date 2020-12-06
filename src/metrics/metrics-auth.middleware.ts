import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IncomingMessage } from "http";

@Injectable()
export class MetricsAuthMiddleware implements NestMiddleware {
  private readonly expectedHeaderValue: string;

  constructor(config: ConfigService) {
    const username = config.get<string>("PROMETHEUS_BASIC_AUTH_USERNAME");
    const password = config.get<string>("PROMETHEUS_BASIC_AUTH_PASSWORD");

    this.expectedHeaderValue = MetricsAuthMiddleware.buildHeaderValue(
      username,
      password
    );
  }

  private static buildHeaderValue(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }

  use(req: IncomingMessage, res: any, next: () => void) {
    const header = req.headers?.authorization;

    if (header !== this.expectedHeaderValue) {
      throw new UnauthorizedException("MetricsBasicAuthNotMatching");
    }

    next();
  }
}
