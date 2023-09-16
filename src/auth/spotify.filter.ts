import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class SpotifyAuthFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let reason = "unknown";

    if (exception.name === "TokenError") {
      // Error during oauth2 flow
      reason = "oauth2";
    } else if (
      exception instanceof ForbiddenException &&
      exception.message === "UserNotInUserFilter"
    ) {
      // User ID is not in the whitelist
      reason = "whitelist";
    }

    this.logger.error(
      `Login with Spotify failed: ${exception}`,
      exception.stack,
    );

    response.redirect(`/login/failure?reason=${reason}&source=spotify`);
  }
}
