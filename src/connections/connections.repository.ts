import { EntityRepository, Repository } from "typeorm";
import { Connection } from "./connection.entity";

@EntityRepository(Connection)
export class ConnectionsRepository extends Repository<Connection> {}
