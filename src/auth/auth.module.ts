import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { SpotifyStrategy } from "./spotify.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get<string>("JWT_EXPIRATION_TIME") }
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  providers: [AuthService, SpotifyStrategy, JwtStrategy],
  exports: [PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
