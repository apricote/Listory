import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { IncomingMessage } from "http";
import { MetricsAuthMiddleware } from "./metrics-auth.middleware";

describe("MetricsAuthMiddleware", () => {
  let middleware: MetricsAuthMiddleware;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsAuthMiddleware,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: jest
              .fn()
              .mockReturnValueOnce("foo") // Username
              .mockReturnValueOnce("bar"), // Password
          }),
        },
      ],
    }).compile();

    middleware = module.get<MetricsAuthMiddleware>(MetricsAuthMiddleware);
    config = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(middleware).toBeDefined();
    expect(config).toBeDefined();
  });

  describe("use", () => {
    let req: IncomingMessage;
    let res: any;
    let next: () => void;

    beforeEach(() => {
      req = {
        headers: { authorization: `Basic Zm9vOmJhcg==` },
      } as IncomingMessage; // Buffer.from("foo:bar").toString("base64")

      res = {};

      next = jest.fn();
    });

    it("calls next", async () => {
      middleware.use(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("throws UnauthorizedException if header is not set", async () => {
      delete req.headers.authorization;

      expect(() => middleware.use(req, res, next)).toThrow(
        UnauthorizedException
      );
    });

    it("throws UnauthorizedException if header does not match", async () => {
      req.headers.authorization = `Basic doesnotmatch`;

      expect(() => middleware.use(req, res, next)).toThrow(
        UnauthorizedException
      );
    });
  });
});
