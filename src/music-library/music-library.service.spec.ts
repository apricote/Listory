import { Test, TestingModule } from "@nestjs/testing";
import { MusicLibraryService } from "./music-library.service";

describe("MusicLibraryService", () => {
  let service: MusicLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicLibraryService],
    }).compile();

    service = module.get<MusicLibraryService>(MusicLibraryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
