import { Test, TestingModule } from "@nestjs/testing";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

describe("Reports Controller", () => {
  let controller: ReportsController;
  let reportsService: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useFactory: () => ({}) }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(reportsService).toBeDefined();
  });
});
