import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyApiService } from './spotify-api.service';

describe('SpotifyApiService', () => {
  let service: SpotifyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyApiService],
    }).compile();

    service = module.get<SpotifyApiService>(SpotifyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
