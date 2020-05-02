import { Injectable, Scope, Logger as NestLogger } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends NestLogger {}
