import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from "@nestjs/config";

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
        JWT_EXPIRATION_TIME: Joi.string().default("1d"),

        // Spotify
        SPOTIFY_CLIENT_ID: Joi.string().required(),
        SPOTIFY_CLIENT_SECRET: Joi.string().required(),
        SPOTIFY_FETCH_INTERVAL_MS: Joi.number().default(5 * 60 * 1000),
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
      }),
    }),
  ],
})
export class ConfigModule {}
