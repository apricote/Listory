import { ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { AuthSession } from "./auth-session.entity";
import { AuthSessionRepository } from "./auth-session.repository";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

describe("AuthService", () => {
  let service: AuthService;
  let config: ConfigService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let authSessionRepository: AuthSessionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useFactory: () => ({ get: jest.fn().mockReturnValue("FOOBAR") }),
        },
        { provide: UsersService, useFactory: () => ({}) },
        { provide: JwtService, useFactory: () => ({}) },
        { provide: AuthSessionRepository, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    config = module.get<ConfigService>(ConfigService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    authSessionRepository = module.get<AuthSessionRepository>(
      AuthSessionRepository
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(config).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authSessionRepository).toBeDefined();
  });

  describe("spotifyLogin", () => {
    let loginDto: LoginDto;
    let user: User;

    beforeEach(() => {
      loginDto = {
        accessToken: "ACCESS_TOKEN",
        refreshToken: "REFRESH_TOKEN",
        profile: {
          id: "FOOBAR",
          displayName: "Max Mustermann",
          photos: ["https://example.com/profile.jpeg"],
        },
      };

      user = {
        id: "USER",
      } as User;

      service.allowedByUserFilter = jest.fn().mockReturnValue(true);
      usersService.createOrUpdate = jest.fn().mockResolvedValue(user);
    });

    it("returns the logged in user", async () => {
      await expect(service.spotifyLogin(loginDto)).resolves.toEqual(user);
    });

    it("verifies that the user is allowed by the user filter", async () => {
      await service.spotifyLogin(loginDto);

      expect(service.allowedByUserFilter).toHaveBeenCalledTimes(1);
      expect(service.allowedByUserFilter).toHaveBeenCalledWith(
        loginDto.profile.id
      );
    });

    it("throws ForbiddenException is user is not in the filter", async () => {
      service.allowedByUserFilter = jest.fn().mockReturnValue(false);

      await expect(service.spotifyLogin(loginDto)).rejects.toThrow(
        ForbiddenException
      );
    });

    it("updates the user profile with data from spotify", async () => {
      await service.spotifyLogin(loginDto);

      expect(usersService.createOrUpdate).toHaveBeenCalledTimes(1);
      expect(usersService.createOrUpdate).toHaveBeenLastCalledWith({
        displayName: "Max Mustermann",
        photo: "https://example.com/profile.jpeg",
        spotify: {
          id: "FOOBAR",
          accessToken: "ACCESS_TOKEN",
          refreshToken: "REFRESH_TOKEN",
        },
      });
    });
  });

  describe("createSession", () => {
    let user: User;
    let session: AuthSession;
    let refreshToken: string;

    beforeEach(() => {
      user = { id: "USER" } as User;
      session = {
        id: "SESSION",
        user,
      } as AuthSession;
      refreshToken = "REFRESH_TOKEN";

      authSessionRepository.create = jest
        .fn()
        .mockReturnValue({ id: "SESSION" });

      authSessionRepository.save = jest.fn().mockResolvedValue(undefined);

      // @ts-expect-error
      service.createRefreshToken = jest
        .fn()
        .mockResolvedValue({ refreshToken });
    });

    it("returns the session and refresh token", async () => {
      await expect(service.createSession(user)).resolves.toEqual({
        session,
        refreshToken,
      });
    });

    it("creates a new session", async () => {
      await service.createSession(user);

      expect(authSessionRepository.create).toHaveBeenCalledTimes(1);
      expect(authSessionRepository.save).toHaveBeenCalledTimes(1);
      expect(authSessionRepository.save).toHaveBeenCalledWith(session);
    });

    it("it creates a refresh token", async () => {
      await service.createSession(user);

      // @ts-expect-error
      expect(service.createRefreshToken).toHaveBeenCalledTimes(1);
      // @ts-expect-error
      expect(service.createRefreshToken).toHaveBeenCalledWith(session);
    });
  });

  describe("createRefreshToken", () => {
    let session: AuthSession;
    let refreshToken: string;

    beforeEach(() => {
      session = {
        user: { id: "USER", displayName: "Max Mustermann" } as User,
        id: "SESSION",
      } as AuthSession;

      refreshToken = "REFRESH_TOKEN";

      jwtService.signAsync = jest.fn().mockResolvedValue(refreshToken);
    });

    it("returns the refreshToken", async () => {
      // @ts-expect-error
      await expect(service.createRefreshToken(session)).resolves.toEqual({
        refreshToken,
      });
    });

    it("creates a token with correct values", async () => {
      // @ts-expect-error
      service.sessionExpirationTime = "EXPIRATION_TIME";

      // @ts-expect-error
      await service.createRefreshToken(session);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: "USER", name: "Max Mustermann" },
        {
          jwtid: session.id,
          expiresIn: "EXPIRATION_TIME",
        }
      );
    });
  });

  describe("createAccessToken", () => {
    let session: AuthSession;
    let accessToken: string;

    beforeEach(() => {
      session = {
        id: "AUTH_SESSION",
        user: {
          id: "USER",
          displayName: "Max Mustermann",
          photo: "https://example.com/picture.jpg",
        },
      } as AuthSession;

      accessToken = "ACCESS_TOKEN";

      jwtService.signAsync = jest.fn().mockResolvedValue(accessToken);
    });

    it("returns the access token", async () => {
      await expect(service.createAccessToken(session)).resolves.toEqual({
        accessToken,
      });
    });

    it("throws ForbiddenException if the session is revoked", async () => {
      session.revokedAt = new Date("2020-01-01T00:00:00Z");

      await expect(service.createAccessToken(session)).rejects.toThrow(
        ForbiddenException
      );
    });

    it("creates a token with correct values", async () => {
      await service.createAccessToken(session);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenLastCalledWith({
        sub: "USER",
        name: "Max Mustermann",
        picture: "https://example.com/picture.jpg",
      });
    });
  });

  describe("findSession", () => {
    let session: AuthSession;

    beforeEach(() => {
      session = { id: "AUTH_SESSION" } as AuthSession;

      authSessionRepository.findOne = jest.fn().mockResolvedValue(session);
    });

    it("returns the session", async () => {
      await expect(service.findSession("AUTH_SESSION")).resolves.toEqual(
        session
      );

      expect(authSessionRepository.findOne).toHaveBeenCalledTimes(1);
      expect(authSessionRepository.findOne).toHaveBeenLastCalledWith(
        "AUTH_SESSION"
      );
    });
  });

  describe("findUser", () => {
    let user: User;

    beforeEach(() => {
      user = { id: "USER" } as User;

      usersService.findById = jest.fn().mockResolvedValue(user);
    });

    it("returns the user", async () => {
      await expect(service.findUser("USER")).resolves.toEqual(user);

      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenLastCalledWith("USER");
    });
  });

  describe("allowedByUserFilter", () => {
    it("returns true if user filter is unset", () => {
      // @ts-expect-error
      service.userFilter = null;

      expect(service.allowedByUserFilter("123")).toEqual(true);
    });

    it("returns true if the user filter is an empty string", () => {
      // @ts-expect-error
      service.userFilter = "";

      expect(service.allowedByUserFilter("123")).toEqual(true);
    });

    it("returns true if the user is the only user in filter", () => {
      // @ts-expect-error
      service.userFilter = "123";

      expect(service.allowedByUserFilter("123")).toEqual(true);
    });

    it("returns true if the user is one of the users in filter", () => {
      // @ts-expect-error
      service.userFilter = "123,456";

      expect(service.allowedByUserFilter("456")).toEqual(true);
    });

    it("returns false if the user is not in the filter", () => {
      // @ts-expect-error
      service.userFilter = "123,456";

      expect(service.allowedByUserFilter("789")).toEqual(false);
    });
  });
});
