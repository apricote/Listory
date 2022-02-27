import { context, trace } from "@opentelemetry/api";
import Pino, { Logger, LoggerOptions } from "pino";

export const loggerOptions: LoggerOptions = {
  level: "debug",
  formatters: {
    level(label) {
      return { level: label };
    },
    log(object) {
      const span = trace.getSpan(context.active());
      if (!span) return { ...object };
      const { spanId, traceId } = trace
        .getSpan(context.active())
        ?.spanContext();
      return { ...object, spanId, traceId };
    },
  },
  transport:
    process.env.NODE_ENV === "local"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: true,
          },
        }
      : null,
};

export const logger: Logger = Pino(loggerOptions);
