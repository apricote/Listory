import { Controller, Get } from "@nestjs/common";
import { AuthAccessToken } from "../auth/decorators/auth-access-token.decorator";
import { ReqUser } from "../auth/decorators/req-user.decorator";
import { User } from "./user.entity";

@Controller("api/v1/users")
export class UsersController {
  @Get("me")
  @AuthAccessToken()
  getMe(@ReqUser() user: User): Omit<User, "spotify"> {
    return {
      id: user.id,
      displayName: user.displayName,
      photo: user.photo,
    };
  }
}
