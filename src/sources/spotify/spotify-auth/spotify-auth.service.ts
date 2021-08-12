import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SpotifyConnection } from "../spotify-connection.entity";

@Injectable()
export class SpotifyAuthService {
  private readonly clientID: string;
  private readonly clientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    config: ConfigService
  ) {
    this.clientID = config.get<string>("SPOTIFY_CLIENT_ID");
    this.clientSecret = config.get<string>("SPOTIFY_CLIENT_SECRET");
  }

  async clientCredentialsGrant(): Promise<string> {
    const response = await this.httpService
      .post<{ access_token: string }>(
        `api/token`,
        "grant_type=client_credentials",
        {
          auth: {
            username: this.clientID,
            password: this.clientSecret,
          },
        }
      )
      .toPromise();

    return response.data.access_token;
  }

  async refreshAccessToken(connection: SpotifyConnection): Promise<string> {
    const response = await this.httpService
      .post<any>(
        `api/token`,
        `grant_type=refresh_token&refresh_token=${connection.refreshToken}`,
        {
          auth: {
            username: this.clientID,
            password: this.clientSecret,
          },
        }
      )
      .toPromise();

    return response.data.access_token;
  }
}
