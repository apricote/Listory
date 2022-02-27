import { Test, TestingModule } from "@nestjs/testing";
import { ListensService } from "../../listens/listens.service";
import { MusicLibraryService } from "../../music-library/music-library.service";
import { UsersService } from "../../users/users.service";
import { SpotifyApiService } from "./spotify-api/spotify-api.service";
import { SpotifyAuthService } from "./spotify-auth/spotify-auth.service";
import { SpotifyService } from "./spotify.service";

describe("SpotifyService", () => {
  let service: SpotifyService;
  let usersService: UsersService;
  let listensService: ListensService;
  let musicLibraryService: MusicLibraryService;
  let spotifyApi: SpotifyApiService;
  let spotifyAuth: SpotifyAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        { provide: UsersService, useFactory: () => ({}) },
        { provide: ListensService, useFactory: () => ({}) },
        { provide: MusicLibraryService, useFactory: () => ({}) },
        { provide: SpotifyApiService, useFactory: () => ({}) },
        { provide: SpotifyAuthService, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    usersService = module.get<UsersService>(UsersService);
    listensService = module.get<ListensService>(ListensService);
    musicLibraryService = module.get<MusicLibraryService>(MusicLibraryService);
    spotifyApi = module.get<SpotifyApiService>(SpotifyApiService);
    spotifyAuth = module.get<SpotifyAuthService>(SpotifyAuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(listensService).toBeDefined();
    expect(musicLibraryService).toBeDefined();
    expect(spotifyApi).toBeDefined();
    expect(spotifyAuth).toBeDefined();
  });
});
