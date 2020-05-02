import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { Logger } from "../logger/logger.service";

@Catch()
export class SpotifyAuthFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let reason = "unknown";

    if (exception.name === "TokenError") {
      // Error during oauth2 flow
      reason = "oauth2";
    }

    this.logger.error(
      `Login with Spotify failed: ${exception}`,
      exception.stack
    );

    response.redirect(`/login/failure?reason=${reason}&source=spotify`);
  }
}
