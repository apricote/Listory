import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { RefreshTokenStrategy } from "./refresh-token.strategy";

describe("RefreshTokenStrategy", () => {
  let strategy: RefreshTokenStrategy;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        { provide: AuthService, useFactory: () => ({}) },
        {
          provide: ConfigService,
          useFactory: () => ({ get: jest.fn().mockReturnValue("foobar") }),
        },
      ],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
    expect(authService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("validate", () => {
    let session;
    let payload;

    beforeEach(() => {
      payload = { jti: "123-foo-bar" };

      session = { mock: "Session" };
      authService.findSession = jest.fn().mockResolvedValue(session);
    });

    it("return session from authService", async () => {
      await expect(strategy.validate(payload)).resolves.toEqual(session);

      expect(authService.findSession).toHaveBeenCalledTimes(1);
      expect(authService.findSession).toHaveBeenCalledWith(payload.jti);
    });

    it("throws UnauthorizedException if session does not exist", async () => {
      authService.findSession = jest.fn().mockResolvedValue(undefined);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("throws ForbiddenException is session is revoked", async () => {
      session.revokedAt = "2021-01-01";

      await expect(strategy.validate(payload)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
