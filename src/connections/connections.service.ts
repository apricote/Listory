import { Injectable } from "@nestjs/common";
import { ConnectionsRepository } from "./connections.repository";

@Injectable()
export class ConnectionsService {
  constructor(private readonly connectionRepository: ConnectionsRepository) {}
}
