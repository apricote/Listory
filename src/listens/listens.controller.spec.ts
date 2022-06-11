import { Test, TestingModule } from "@nestjs/testing";
import { Pagination } from "nestjs-typeorm-paginate";
import { User } from "../users/user.entity";
import { GetListensFilterDto } from "./dto/get-listens.dto";
import { Listen } from "./listen.entity";
import { ListensController } from "./listens.controller";
import { ListensService } from "./listens.service";

describe("Listens Controller", () => {
  let controller: ListensController;
  let listensService: ListensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListensController],
      providers: [{ provide: ListensService, useFactory: () => ({}) }],
    }).compile();

    controller = module.get<ListensController>(ListensController);
    listensService = module.get<ListensService>(ListensService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(listensService).toBeDefined();
  });

  describe("getRecentlyPlayed", () => {
    let filter: GetListensFilterDto;
    let user: User;
    let listens: Pagination<Listen>;

    beforeEach(() => {
      filter = { time: { start: new Date(), end: new Date() } };
      user = { id: "USER" } as User;

      listens = { items: [{ id: "LISTEN" } as Listen] } as Pagination<Listen>;

      listensService.getListens = jest.fn().mockResolvedValue(listens);
    });

    it("returns the listens", async () => {
      await expect(
        controller.getRecentlyPlayed(filter, user, 1, 10)
      ).resolves.toEqual(listens);

      expect(listensService.getListens).toHaveBeenCalledTimes(1);
      expect(listensService.getListens).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        user,
        filter,
      });
    });

    it("clamps the limit to 100", async () => {
      await controller.getRecentlyPlayed(filter, user, 1, 1000);

      expect(listensService.getListens).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 })
      );
    });
  });
});
