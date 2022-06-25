import { Repository } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
