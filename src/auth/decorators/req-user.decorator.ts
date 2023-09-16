import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqUser = createParamDecorator<void>(
  (_: void, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
