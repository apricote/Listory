import { AuthGuard } from "@nestjs/passport";
import { AuthStrategy } from "../strategies/strategies.enum";

// Internal
export const AccessTokenAuthGuard = AuthGuard(AuthStrategy.AccessToken);
export const RefreshTokenAuthGuard = AuthGuard(AuthStrategy.RefreshToken);

// Auth Provider
export const SpotifyAuthGuard = AuthGuard(AuthStrategy.Spotify);
