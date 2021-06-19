import { Test, TestingModule } from "@nestjs/testing";
import type { Response } from "express";
import { Logger } from "../logger/logger.service";
import { User } from "../users/user.entity";
import { AuthSession } from "./auth-session.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { COOKIE_REFRESH_TOKEN } from "./constants";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useFactory: () => ({}) },
        { provide: Logger, useClass: Logger },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe("spotifyCallback", () => {
    let user: User;
    let res: Response;
    let refreshToken: string;

    beforeEach(() => {
      user = { id: "user" } as User;
      res = {
        statusCode: 200,
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      refreshToken = "REFRESH_TOKEN";
      authService.createSession = jest.fn().mockResolvedValue({ refreshToken });
    });

    it("creates session for user", async () => {
      await controller.spotifyCallback(user, res);

      expect(authService.createSession).toHaveBeenCalledTimes(1);
      expect(authService.createSession).toHaveBeenCalledWith(user);
    });

    it("sets refresh token as cookie", async () => {
      await controller.spotifyCallback(user, res);

      expect(res.cookie).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(
        COOKIE_REFRESH_TOKEN,
        refreshToken,
        { httpOnly: true }
      );
    });

    it("redirects to login success page", async () => {
      await controller.spotifyCallback(user, res);

      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        "/login/success?source=spotify"
      );
    });
  });

  describe("refreshAccessToken", () => {
    let session: AuthSession;
    let accessToken: string;

    beforeEach(() => {
      session = { id: "session" } as AuthSession;
      accessToken = "ACCESS_TOKEN";

      authService.createAccessToken = jest
        .fn()
        .mockResolvedValue({ accessToken });
    });

    it("returns new access token", async () => {
      await expect(controller.refreshAccessToken(session)).resolves.toEqual({
        accessToken,
      });

      expect(authService.createAccessToken).toHaveBeenCalledTimes(1);
      expect(authService.createAccessToken).toHaveBeenCalledWith(session);
    });
  });
});
