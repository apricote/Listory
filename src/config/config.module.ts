import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Application
        PORT: Joi.number().default(3000),
        APP_URL: Joi.string().default("http://localhost:3000"),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_ALGORITHM: Joi.string()
          .default("HS256")
          .allow("HS256", "HS384", "HS512"),

        JWT_EXPIRATION_TIME: Joi.string().default("15m"),
        SESSION_EXPIRATION_TIME: Joi.string().default("1y"),

        // Spotify
        SPOTIFY_CLIENT_ID: Joi.string().required(),
        SPOTIFY_CLIENT_SECRET: Joi.string().required(),
        SPOTIFY_FETCH_INTERVAL_SEC: Joi.number().default(60),
        SPOTIFY_UPDATE_INTERVAL_SEC: Joi.number().default(60),
        SPOTIFY_WEB_API_URL: Joi.string().default("https://api.spotify.com/"),
        SPOTIFY_AUTH_API_URL: Joi.string().default(
          "https://accounts.spotify.com/"
        ),
        SPOTIFY_USER_FILTER: Joi.string(),

        // DB
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_POOL_MAX: Joi.number().default(50),

        // Sentry (Optional)
        SENTRY_ENABLED: Joi.boolean().default(false),
        SENTRY_DSN: Joi.string().when("SENTRY_ENABLED", {
          is: Joi.valid(true),
          then: Joi.required(),
        }),

        // Prometheus for Metrics (Optional)
        PROMETHEUS_ENABLED: Joi.boolean().default(false),
        PROMETHEUS_BASIC_AUTH: Joi.boolean().default(false),
        PROMETHEUS_BASIC_AUTH_USERNAME: Joi.string().when(
          "PROMETHEUS_BASIC_AUTH",
          {
            is: Joi.valid(true),
            then: Joi.required(),
          }
        ),
        PROMETHEUS_BASIC_AUTH_PASSWORD: Joi.string().when(
          "PROMETHEUS_BASIC_AUTH",
          {
            is: Joi.valid(true),
            then: Joi.required(),
          }
        ),
      }),
    }),
  ],
})
export class ConfigModule {}
