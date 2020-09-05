import { Injectable, NestMiddleware } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import type { RequestHandler } from "express";

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  private readonly middleware: RequestHandler;

  constructor() {
    this.middleware = cookieParser();
  }

  use(req: any, res: any, next: () => void) {
    return this.middleware(req, res, next);
  }
}
