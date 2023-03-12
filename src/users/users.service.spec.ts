import { JobService } from "@apricote/nest-pg-boss";
import { Test, TestingModule } from "@nestjs/testing";
import { IImportSpotifyJob, ImportSpotifyJob } from "../sources/jobs";
import { UserRepository } from "./user.repository";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let userRepository: UserRepository;
  let importSpotifyJobService: JobService<IImportSpotifyJob>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: () => ({}) },
        {
          provide: ImportSpotifyJob.ServiceProvider.provide,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    importSpotifyJobService = module.get<JobService<IImportSpotifyJob>>(
      ImportSpotifyJob.ServiceProvider.provide
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(importSpotifyJobService).toBeDefined();
  });
});
