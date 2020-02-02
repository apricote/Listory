import { EntityRepository, Repository } from "typeorm";
import { Listen } from "./listen.entity";

@EntityRepository(Listen)
export class ListenRepository extends Repository<Listen> {}
