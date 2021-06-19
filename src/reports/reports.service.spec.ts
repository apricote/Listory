import { Test, TestingModule } from "@nestjs/testing";
import { ListensService } from "../listens/listens.service";
import { ReportsService } from "./reports.service";

describe("ReportsService", () => {
  let service: ReportsService;
  let listensService: ListensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: ListensService, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    listensService = module.get<ListensService>(ListensService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(listensService).toBeDefined();
  });
});
