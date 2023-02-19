import { AuthGuard } from "@nestjs/passport";
import { AuthStrategy } from "../strategies/strategies.enum";

// Internal
export const ApiAuthGuard = AuthGuard([
  AuthStrategy.AccessToken,
  AuthStrategy.ApiToken,
]);
export const RefreshTokenAuthGuard = AuthGuard(AuthStrategy.RefreshToken);

// Auth Provider
export const SpotifyAuthGuard = AuthGuard(AuthStrategy.Spotify);
