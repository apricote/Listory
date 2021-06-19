import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });
});
