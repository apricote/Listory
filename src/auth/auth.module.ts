import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CookieParserMiddleware } from "../cookie-parser";
import { TypeOrmRepositoryModule } from "../database/entity-repository/typeorm-repository.module";
import { UsersModule } from "../users/users.module";
import { AuthSessionRepository } from "./auth-session.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { SpotifyStrategy } from "./strategies/spotify.strategy";

@Module({
  imports: [
    TypeOrmRepositoryModule.for([AuthSessionRepository]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRATION_TIME"),
          algorithm: config.get("JWT_ALGORITHM"),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    SpotifyStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes("api/v1/auth");
  }
}
