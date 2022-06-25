import { Repository } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { Genre } from "./genre.entity";

@EntityRepository(Genre)
export class GenreRepository extends Repository<Genre> {}
