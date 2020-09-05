import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AccessTokenAuthGuard } from "../guards/auth-strategies.guard";

export function AuthAccessToken() {
  return applyDecorators(
    UseGuards(AccessTokenAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
