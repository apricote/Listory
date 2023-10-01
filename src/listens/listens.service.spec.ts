import { Test, TestingModule } from "@nestjs/testing";
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from "nestjs-typeorm-paginate";
import { User } from "../users/user.entity";
import { GetListensDto } from "./dto/get-listens.dto";
import { Listen } from "./listen.entity";
import { ListenRepository, ListenScopes } from "./listen.repository";
import { ListensService } from "./listens.service";

jest.mock("nestjs-typeorm-paginate");

describe("ListensService", () => {
  let service: ListensService;
  let listenRepository: ListenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListensService,
        { provide: ListenRepository, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<ListensService>(ListensService);
    listenRepository = module.get<ListenRepository>(ListenRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(listenRepository).toBeDefined();
  });

  describe("getListens", () => {
    let options: GetListensDto & IPaginationOptions;
    let user: User;
    let scopes: ListenScopes;

    let listen: Listen;

    beforeEach(() => {
      user = { id: "USER" } as User;

      options = {
        page: 2,
        limit: 45,
        user,
        filter: {},
      };

      // @ts-expect-error
      scopes = {
        byUser: jest.fn().mockReturnThis(),
        duringInterval: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };
      // @ts-expect-error
      listenRepository.scoped = scopes;

      listen = {
        id: "LISTEN",
      } as Listen;

      (paginate as jest.Mock).mockResolvedValue({ items: [listen] });
    });

    it("returns the listens", async () => {
      await expect(service.getListens(options)).resolves.toEqual({
        items: [listen],
      });

      expect(paginate).toHaveBeenCalledTimes(1);
      expect(paginate).toHaveBeenCalledWith(scopes, {
        page: options.page,
        limit: options.limit,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
      });
    });

    it("filters for user", async () => {
      await service.getListens(options);

      expect(scopes.byUser).toHaveBeenCalledTimes(1);
      expect(scopes.byUser).toHaveBeenCalledWith(user);
    });

    it("filters for time", async () => {
      await service.getListens(options);
      expect(scopes.duringInterval).toHaveBeenCalledTimes(0);

      jest.clearAllMocks();

      options.filter.time = {
        start: new Date("2021-01-01T00:00:00Z"),
        end: new Date("2021-01-01T00:00:00Z"),
      };

      await service.getListens(options);

      expect(scopes.duringInterval).toHaveBeenCalledTimes(1);
      expect(scopes.duringInterval).toHaveBeenCalledWith(options.filter.time);
    });
  });

  describe("getScopedQueryBuilder", () => {
    let scopes: ListenScopes;

    beforeEach(() => {
      // @ts-expect-error
      scopes = { id: "SCOPES" };
      // @ts-expect-error
      listenRepository.scoped = scopes;
    });

    it("returns the scoped query builder", async () => {
      expect(service.getScopedQueryBuilder()).toEqual(scopes);
    });
  });
});
