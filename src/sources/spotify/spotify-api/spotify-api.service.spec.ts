import { HttpService } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SpotifyApiService } from "./spotify-api.service";

describe("SpotifyApiService", () => {
  let service: SpotifyApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyApiService,
        { provide: HttpService, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<SpotifyApiService>(SpotifyApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
