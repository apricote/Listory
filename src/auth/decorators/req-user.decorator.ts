import { createParamDecorator } from "@nestjs/common";

export const ReqUser = createParamDecorator((data, req) => req.user);
