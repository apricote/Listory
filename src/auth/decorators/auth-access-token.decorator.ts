import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ApiAuthGuard } from "../guards/auth-strategies.guard";

export function AuthAccessToken() {
  return applyDecorators(
    UseGuards(ApiAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
