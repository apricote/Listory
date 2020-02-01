import { Controller, Get } from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { ReqUser } from "../auth/decorators/req-user.decorator";
import { User } from "./user.entity";

@Controller("api/v1/users")
export class UsersController {
  @Get("me")
  @Auth()
  getMe(@ReqUser() user: User): Omit<User, "spotify"> {
    return {
      id: user.id,
      displayName: user.displayName,
      photo: user.photo
    };
  }
}
