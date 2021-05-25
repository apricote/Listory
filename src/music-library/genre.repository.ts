import { EntityRepository, Repository } from "typeorm";
import { Genre } from "./genre.entity";

@EntityRepository(Genre)
export class GenreRepository extends Repository<Genre> {}
