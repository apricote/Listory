import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("api/v1/connections")
export class ConnectionsController {
  @Get()
  @UseGuards(AuthGuard("jwt"))
  get() {
    return { msg: "Success!" };
  }
}
