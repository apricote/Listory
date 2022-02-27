import { Module, RequestMethod } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";
import { logger } from "./logger";

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        logger: logger,
        autoLogging: true,
        quietReqLogger: true,
        redact: ["req.headers", "res.headers"],
      },
      exclude: [{ method: RequestMethod.ALL, path: "/" }],
    }),
  ],
})
export class LoggerModule {}
