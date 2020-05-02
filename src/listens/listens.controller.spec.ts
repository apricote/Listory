import { Test, TestingModule } from "@nestjs/testing";
import { ListensController } from "./listens.controller";

describe("Listens Controller", () => {
  let controller: ListensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListensController],
    }).compile();

    controller = module.get<ListensController>(ListensController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
