import { Test, TestingModule } from "@nestjs/testing";
import { ListensService } from "./listens.service";

describe("ListensService", () => {
  let service: ListensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListensService]
    }).compile();

    service = module.get<ListensService>(ListensService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
